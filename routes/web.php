<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

Route::post('/user/login', function (Request $request) {
    $credentials = $request->only('email', 'password')?: $request->json()->all();

    if (!Auth::attempt($credentials)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    $user = Auth::user();
    $token = null;

    if ($request->expectsJson()) {
        $token = $user->createToken('mobile-app')->plainTextToken;
    } else {
        $request->session()->regenerate();
    }

    return response()->json([
        'message' => 'Logged in successfully',
        'user' => $user,
        'token' => $token,
    ]);
})->middleware('web');

Route::post('/user/signup', function (Request $request) {
    $data = $request->validate([
        'email' => 'required|email|unique:users,email',
        'name' => 'required',
        'password' => 'required|min:5',
    ], $request->json()->all());

    $user = User::create([
        'name' => $data['name'],
        'email' => $data['email'],
        'password' => Hash::make($data['password']),
    ]);

    Auth::login($user);
    $request->session()->regenerate();

    return response()->json([
        'message' => 'User created successfully',
        'user' => $user,
    ]);
})->middleware('web');

Route::get('/user/me', function (Request $request) {
    $user = Auth::user();

    if (!$user && $request->bearerToken()) {
        $user = User::whereHas('tokens', function($q) use ($request) {
            $q->where('token', hash('sha256', $request->bearerToken()));
        })->first();
    }

    return $user ? response()->json($user) : response()->json(null, 401);
})->middleware('web');

Route::post('/user/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return response()->json(['message' => 'Logged out']);
})->middleware('web');


Route::get('/csrf-token', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});

Route::get('/{any}', function () {
    return view('app');
})->where('any', '^(?!api|auth).*$');
