import {
  animation, trigger,
  transition, animate, style, state
} from '@angular/animations';

export const transAnimation = animation([
  style({
    opacity: '{{ opacity }}',
    backgroundColor: '{{ backgroundColor }}'
  }),
  animate('{{ time }}')
]);
export const fade = trigger('fade', [
   state('inactive', style({ opacity: 0 })),
   state('active', style({ opacity: 1 })),
   transition('* <=> *', [
    animate(2000)
   ])
]);
