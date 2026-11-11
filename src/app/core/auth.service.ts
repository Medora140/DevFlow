import {computed, Injectable, signal} from '@angular/core';

export interface AppUser{
    name: string;
    email:string;
}

@Injectable({providedIn: 'root'}) 
// global, single-instance service

export class AuthService{
    private readonly userState= signal<AppUser | null>(null);

    readonly currentUser=this.userState.asReadonly();
    readonly isAuthenticated= computed(()=> this.userState()!==null);

    signIn(email: string, name?:string):void{
        const displayName= name?.trim() || email.split('@')[0] || 'User';
        this.userState.set({name:displayName, email:email.trim()});
    }
    updateName(name:string):void{
        const currentUser=this.userState();
        const trimmedName=name.trim();

        if(currentUser && trimmedName){
            this.userState.set({...currentUser, name:trimmedName});
        }
    }
    signOut():void{
        this.userState.set(null);
    }
}