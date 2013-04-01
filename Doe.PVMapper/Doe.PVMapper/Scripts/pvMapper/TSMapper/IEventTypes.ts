/// <reference path="Score.ts" />


//Decares all the parameter types that should be used in the api between objects
module pvMapper{
    export interface IScoreValueChangedEvent{
        score:Score;
        oldValue:number;
        newValue:number;        
    }

    interface IScoreLineChangedEvent{
            
    }
}