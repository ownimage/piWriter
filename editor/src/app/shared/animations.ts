import {trigger, state, animate, transition, style, query} from '@angular/animations';

// based on http://www.codershood.info/2017/08/25/angular-router-animation/
// and https://medium.com/google-developer-experts/angular-2-animate-router-transitions-6de179e00204
export const slideInOutAnimation =
    // trigger name for attaching this animation to an element using the [@triggerName] syntax
    trigger('slideInOutAnimation', [
        state('void', style({position:'static', width:'100%'}) ),
        state('*', style({position:'static', width:'100%'}) ),
        transition(':enter', [  // before 2.1: transition('void => *', [
            style({position:'fixed', width:'100%'}),
            style({transform: 'translateY(100%)'}),
            animate('0.5s ease-in-out', style({transform: 'translateY(0%)'}))
        ]),
        transition(':leave', [  // before 2.1: transition('* => void', [
            style({position:'fixed', width:'100%'}),
            style({transform: 'translateY(0%)'}),
            animate('0.5s ease-in-out', style({transform: 'translateY(-100%)'}))
        ])
    ]);