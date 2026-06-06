import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createTask } from '@/hooks/useTask';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';

export default function CreateTaskButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { mutateAsync, isPending } = createTask();

  const onSubmit = async (data) => {
    try {
      await mutateAsync(data);
      toast.success('Task recorded');
      reset();
      setIsOpen(false);
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to record task');
    }
  };

  return (
    <>
      <button
        className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary/90 transition-all shadow-sm active:scale-95"
        onClick={() => setIsOpen(true)}
      >
        <Plus size={18} strokeWidth={2.5} />
        <span>New Intent</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50 p-6"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-card ring-1 ring-border shadow-2xl w-full max-w-xl rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-300"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-8 md:p-10 space-y-8">
              <div className="space-y-2">
                <h2 className="text-4xl font-heading text-foreground">Record Intent</h2>
                <p className="text-muted-foreground font-serif italic italic">Define your next focus.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium" htmlFor="title">
                      Title
                    </label>
                    <input
                      id="title"
                      {...register('title', { required: 'A title is required' })}
                      placeholder="What is the essence of this task?"
                      className="w-full bg-transparent border-b border-border py-2 text-xl focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/30 font-serif"
                    />
                    {errors.title && (
                      <p className="text-destructive text-sm italic">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium" htmlFor="description">
                      Description
                    </label>
                    <textarea
                      id="description"
                      rows={4}
                      {...register('description', { required: 'A description is required' })}
                      placeholder="Provide the depth and context..."
                      className="w-full bg-transparent border-b border-border py-2 text-lg focus:outline-none focus:border-primary transition-colors resize-none placeholder:text-muted-foreground/30 font-serif"
                    />
                    {errors.description && (
                      <p className="text-destructive text-sm italic">{errors.description.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end items-center gap-6 pt-4">
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                    onClick={() => {
                      reset();
                      setIsOpen(false);
                    }}
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-8 py-3 bg-foreground text-background font-medium rounded-full hover:bg-foreground/90 transition-all disabled:opacity-50"
                  >
                    {isPending ? 'Recording…' : 'Finalize Intent'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}