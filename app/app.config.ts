export default defineAppConfig({
  ui: {
    colors: {
      primary: 'brand',
      neutral: 'slate',
    },
    button: {
      defaultVariants: { size: 'md' },
      slots: { base: 'rounded-sm font-medium cursor-pointer transition-colors' },
    },
    input: { defaultVariants: { size: 'lg' } },
    textarea: { defaultVariants: { size: 'lg' } },
    alert: { defaultVariants: { variant: 'soft' }, slots: { root: 'rounded-sm' } },
    select: { defaultVariants: { size: 'lg' } },
    switch: {
      slots: {
        root: 'lex-switch',
        base: 'lex-switch-track',
        thumb: 'lex-switch-thumb',
        wrapper: 'lex-switch-copy',
        label: 'lex-switch-label',
        description: 'lex-switch-description',
      },
    },
    dropdownMenu: { slots: { content: 'rounded-sm', item: 'rounded-xs' } },
    formField: {
      slots: { label: 'text-[13px] font-medium text-slate-700', hint: 'text-xs text-slate-500' },
    },
    modal: {
      slots: {
        content: 'bg-white text-slate-800 ring-1 ring-slate-200 rounded-sm',
        header: 'bg-white',
        footer: 'bg-slate-50',
      },
    },
  },
});
