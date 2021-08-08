<?php

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\UnauthorizedException;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function (Request $request) {
        return view('dashboard', [
            'tasks' => $request->user()->tasks,
        ]);
    })->name('dashboard');

    Route::post('/tasks', function (Request $request) {
        $validated = $request->validate([
            'name' => 'string|required|max:50',
        ]);

        Task::query()->create([
            'user_id' => $request->user()->id,
            'name' => $validated['name'],
            'is_completed' => false,
        ]);

        return redirect()->route('dashboard');
    })->name('tasks');

    Route::put('/tasks/{task}', function (Request $request, Task $task) {
        if ($request->user()->id !== $task->user_id) {
            throw new UnauthorizedException();
        }

        if ($request->has('is_completed') && $request->get('is_completed') === 'on') {
            $task->is_completed = true;
            $task->save();
        } else {
            $task->is_completed = false;
            $task->save();
        }

        return redirect()->route('dashboard');
    })->name('tasks.update');

    Route::delete('/tasks/{task}', function (Request $request, Task $task) {
        if ($request->user()->id !== $task->user_id) {
            throw new UnauthorizedException();
        }

        $task->delete();

        return redirect()->route('dashboard');
    })->name('tasks.delete');
});

require __DIR__.'/auth.php';
