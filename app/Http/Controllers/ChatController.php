<?php

namespace App\Http\Controllers;
use Auth;
use App\User;
use App\Events\ChatEvent;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function chat(){
        return view('chat');
    }
    public function send(Request $request){
        $user = User::find(Auth::id());
        $this->saveToSession($request);
        event(new ChatEvent($request->message,$user));
    }

    public function saveToSession(Request $request){
        session()->put('chat',$request->chat);
    }    
    public function getOldMessage(){
        return session('chat');
    }
    public function deleteSession(){
        session()->forget('chat');
    }
    // public function send(){
    //     $message = "Test Message";
    //     $user = User::find(Auth::id());
    //     event(new ChatEvent($message,$user));
    // }
}
