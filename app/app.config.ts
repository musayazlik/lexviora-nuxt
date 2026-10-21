export default defineAppConfig({
  ui: {
    colors: {
      primary: 'brand',
      neutral: 'slate',
    },
    button: {
      defaultVariants: { size: 'md' },
      slots: { base: 'font-medium cursor-pointer transition-colors' },
    },
    input: { defaultVariants: { size: 'lg' } },
    textarea: { defaultVariants: { size: 'lg' } },
    select: { defaultVariants: { size: 'lg' } },
    formField: {
      slots: { label: 'text-[13px] font-medium text-slate-700', hint: 'text-xs text-slate-500' },
    },
    modal: {
      slots: { content: 'bg-white text-slate-800 ring-1 ring-slate-200 rounded-xl', header: 'bg-white', footer: 'bg-slate-50' },
    },
  },
});
