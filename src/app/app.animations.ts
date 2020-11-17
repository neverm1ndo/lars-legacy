import { trigger, style, animate, transition, state, keyframes, query, stagger} from '@angular/animations';

export const settings = trigger('settings', [
  state('*', style({ opacity : '1', transform: 'scale(1)' })),
    state('void', style({
       opacity : '0', transform: 'scale(1.04)'
    })),
        transition('void => *', [
          style({
             opacity : '0', transform: 'scale(1.04)'
          }),
          animate('0.23s cubic-bezier(0.4, 0.0, 0.2, 1)',
          keyframes([
            style({ opacity : '0', transform: 'scale(1.04)'  }),
            style({ opacity : '1', transform: 'scale(1)'  })
          ]))
        ]),
        transition('* => void', [
          style({
             opacity : '1', transform: 'scale(1)'
          }),
          animate('0.23s cubic-bezier(0.4, 0.0, 0.2, 1)',
          keyframes([
            style({ opacity : '1', transform: 'scale(1)'  }),
            style({ opacity : '0', transform: 'scale(1.04)'  })
          ]))
        ])
]);

export const toast = trigger(
      'toast',
      [
        transition(
          ':enter',
          [
            style({
               opacity : '0', transform: 'translateY(-10%)'
            }),
            animate('0.23s cubic-bezier(0.4, 0.0, 0.2, 1)',
            keyframes([
              style({ opacity : '0', transform: 'translateY(-10%)'  }),
              style({ opacity : '1', transform: 'translateY(0%)'  })
            ]))
          ]
        ),
        transition(
          ':leave',
          [
            style({
               opacity : '1', transform: 'translateY(-10%)'
            }),
            animate('0.23s cubic-bezier(0.4, 0.0, 0.2, 1)',
            keyframes([
              style({ opacity : '1', transform: 'translateY(0%)'  }),
              style({ opacity : '0', transform: 'translateY(-10%)'  })
            ]))
          ]
        )
      ]
    )
export const upfade = trigger('upfade', [
  state('*', style({ opacity : '1', transform: 'translateY(0%)' })),
    state('void', style({
       opacity : '0', transform: 'translateY(-10%)'
    })),
        transition('void => *', [
          style({
             opacity : '0', transform: 'translateY(-10%)'
          }),
          animate('0.23s cubic-bezier(0.4, 0.0, 0.2, 1)',
          keyframes([
            style({ opacity : '0', transform: 'translateY(-10%)'  }),
            style({ opacity : '1', transform: 'translateY(0%)'  })
          ]))
        ]),
        transition('* => void', [
          style({
             opacity : '1', transform: 'translateY(0%)'
          }),
          animate('0.23s cubic-bezier(0.4, 0.0, 0.2, 1)',
          keyframes([
            style({ opacity : '1', transform: 'translateY(0%)'  }),
            style({ opacity : '0', transform: 'translateY(-10%)'  })
          ]))
        ])
]);
export const lazy = trigger('lazy', [
  state('*', style({ transform: 'translateY(0%)' })),
    state('void', style({
        transform: 'translateY(100%)'
    })),
        transition('void => *', [
          style({
              transform: 'translateY(100%)'
          }),
          animate('0.15s cubic-bezier(0.4, 0.0, 0.2, 1)',
          keyframes([
            style({ transform: 'translateY(100%)'  }),
            style({ transform: 'translateY(0%)'  })
          ]))
        ]),
        transition('* => void', [
          style({
              transform: 'translateY(0%)'
          }),
          animate('0.15s cubic-bezier(0.4, 0.0, 0.2, 1)',
          keyframes([
            style({  transform: 'translateY(0%)'  }),
            style({  transform: 'translateY(100%)'  })
          ]))
        ])
]);
export const preload = trigger('preload', [
    transition(':enter', [
      query('*', style({ opacity: 0, transform: 'scale(0.98)' })),
      query('*', stagger('20ms', [
        animate('0.4s ease-in', style({ opacity: 1, transform: 'scale(1)'}))
        ]))
      ])
]);
