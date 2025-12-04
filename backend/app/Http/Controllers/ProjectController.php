<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Projeсt;
class ProjectController
{
    public function create(Request $request)
    {
    

            $project = Project::create([
                'tittle' =>$request->tittle,
                'description' => $request->description,
                'owner_id' => $request->owner_id,
            ]);
    
    }
}
