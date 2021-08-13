<?php

return [

    'route' => env('WATERMELON_ROUTE', '/sync'),

    'middleware' => [
        'auth:sanctum',
    ],

    'models' => [
        'tasks' => \App\Models\Task::class,
    ],

];
