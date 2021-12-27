import { trigger, style, animate, transition, state, keyframes, query, stagger, animateChild, group } from '@angular/animations';

export const settings = trigger('settings', [
  state('*', style({ opacity : '1', transform: 'scale(1)', position: 'fixed'  })),
    state('void', style({
       opacity : '0', transform: 'scale(1.04)', position: 'fixed'
    })),
        transition('void => *', [
          style({
             opacity : '0', transform: 'scale(1.04)', position: 'fixed'
          }),
          animate('0.23s cubic-bezier(0.4, 0.0, 0.2, 1)',
          keyframes([
            style({ opacity : '0', transform: 'scale(1.04)', position: 'fixed'  }),
            style({ opacity : '1', transform: 'scale(1)', position: 'fixed'  })
          ]))
        ]),
        transition('* => void', [
          style({
             opacity : '1', transform: 'scale(1)', position: 'fixed'
          }),
          animate('0.23s cubic-bezier(0.4, 0.0, 0.2, 1)',
          keyframes([
            style({ opacity : '1', transform: 'scale(1)', position: 'fixed'  }),
            style({ opacity : '0', transform: 'scale(1.04)', position: 'fixed'  })
          ]))
        ])
]);
export const extrudeToRight = trigger('extrudeRight', [
  state('*', style({ opacity : '1', transform: 'scale(1, 1)', })),
    state('void', style({
       opacity : '0', transform: 'scale(0, 1)',
    })),
        transition('void => *', [
          style({
             opacity : '0', transform: 'scale(0, 1)',
          }),
          animate('0.23s cubic-bezier(0.4, 0.0, 0.2, 1)',
          keyframes([
            style({ opacity : '0', transform: 'scale(0, 1)', }),
            style({ opacity : '1', transform: 'scale(1, 1)',  })
          ]))
        ]),
        transition('* => void', [
          style({
             opacity : '1', transform: 'scale(1)'
          }),
          animate('0.23s cubic-bezier(0.4, 0.0, 0.2, 1)',
          keyframes([
            style({ opacity : '1', transform: 'scale(1, 1)',  }),
            style({ opacity : '0', transform: 'scale(0, 1)', })
          ]))
        ])
]);
export const panelSwitch = trigger('panelSwitch', [
  state('*', style({ opacity : '1', transform: 'translateY(0px)', position: 'fixed'  })),
    state('void', style({
       opacity : '0', transform: 'translateY(20px)', position: 'fixed'
    })),
        transition('void => *', [
          style({
             opacity : '0', transform: 'translateY(20px)', position: 'fixed'
          }),
          animate('0.23s cubic-bezier(0.4, 0.0, 0.2, 1)',
          keyframes([
            style({ opacity : '0', transform: 'translateY(20px)', position: 'fixed'  }),
            style({ opacity : '1', transform: 'translateY(0px)', position: 'fixed'  })
          ]))
        ]),
        transition('* => void', [
          style({
             opacity : '1', transform: 'translateY(0px)', position: 'fixed'
          }),
          animate('0.23s cubic-bezier(0.4, 0.0, 0.2, 1)',
          keyframes([
            style({ opacity : '1', transform: 'translateY(0px)', position: 'fixed'  }),
            style({ opacity : '0', transform: 'translateY(20px)', position: 'fixed'  })
          ]))
        ])
]);
export const flipListItem =  trigger('flipListItem', [
      state('active', style({
        transform: 'rotateY(179.9deg)'
      })),
      state('inactive', style({
        transform: 'rotateY(0)'
      })),
      transition('active => inactive', animate('500ms ease-out')),
      transition('inactive => active', animate('500ms ease-in'))
    ])
export const popblur = trigger('popblur', [
  state('*', style({ 'backdrop-filter': 'blur(20px)'  })),
    state('void', style({
       'backdrop-filter': 'blur(0px)'
    })),
        transition('void => *', [
          style({
            'backdrop-filter': 'blur(0px)'
          }),
          animate('0.1s cubic-bezier(0.4, 0.0, 0.2, 1)',
          keyframes([
            style({'backdrop-filter': 'blur(0px)' }),
            style({ 'backdrop-filter': 'blur(20px)' })
          ]))
        ]),
        transition('* => void', [
          style({
            'backdrop-filter': 'blur(20px)'
          }),
          animate('0.1s cubic-bezier(0.4, 0.0, 0.2, 1)',
          keyframes([
            style({ 'backdrop-filter': 'blur(20px)'  }),
            style({ 'backdrop-filter': 'blur(0px)'  })
          ]))
        ])
]);

export const mapload = trigger('mapload', [
  state('true', style({ filter: 'blur(20px)' })),
  state('false', style({ filter: 'blur(0px)' })),
  transition('false => true', [
    style({ filter: 'blur(0)' }),
    animate('0.23s cubic-bezier(0.4, 0.0, 0.2, 1)',
    keyframes([
      style({ filter: 'blur(0px)' }),
      style({ filter: 'blur(20px)' })
    ]))
  ]),
  transition('true => false', [
    style({ filter: 'blur(20px)' }),
    animate('0.23s cubic-bezier(0.4, 0.0, 0.2, 1)',
    keyframes([
      style({ filter: 'blur(20px)' }),
      style({ filter: 'blur(0px)' })
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
export const settingsRoute =
  trigger('settingsRoute', [
    transition('* => *', [
      style({ opacity : 1, transform: 'scale(1)' }),
      query(':enter, :leave', [
        style({
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%'
        })
      ], { optional: true }),
      query(':enter', [
        style({ transform: 'scale(0.99)', opacity: 0 })
      ], { optional: true }),
      query(':leave', animateChild(), { optional: true }),
      group([
        query(':leave', [
          animate('0.06s cubic-bezier(0.4, 0.0, 0.2, 1)',
          style({ transform: 'scale(0.9)', opacity: 0 }))
        ], { optional: true }),
        query(':enter', [
          animate('0.23s cubic-bezier(0.4, 0.0, 0.2, 1)',
          style({ opacity: 1, transform: 'scale(1)' }))
        ], { optional: true })
      ]),
      query(':enter', animateChild(), { optional: true }),
    ])
  ]);
