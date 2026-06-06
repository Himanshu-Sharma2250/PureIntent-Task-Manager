import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { editTask, fetchTask } from '@/hooks/useTask';
import { cn } from '@/lib/utils';

export default function EditTaskModal({ taskId, onClose }) {
  const { data: task, isLoading } = fetchTask(taskId);
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();
  const editMutation = editTask();

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        status: task.status
      });
    }
  }, [task, reset]);

  const currentStatus = watch('status');

  const onSubmit = async (data) => {
    try {
      await editMutation.mutateAsync({ data, taskId });
      onClose();
    } catch (e) {
      // error toast handled in hook
    }
  };

  if (isLoading) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50 p-6 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="bg-card ring-1 ring-border shadow-2xl w-full max-w-xl rounded-3xl overflow-hidden animate-in zoom-in-95 duration-300 ease-out-expo"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 md:p-10 space-y-8">
          <div className="space-y-2">
            <h2 className="text-4xl font-heading text-foreground">Refine Intent</h2>
            <p className="text-muted-foreground font-serif italic">Adjusting the path forward.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
                  Current State
                </label>
                <div className="flex flex-wrap gap-3">
                  {['PENDING', 'IN_PROGRESS', 'COMPLETE'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setValue('status', status)}
                      className={cn(
                        "px-5 py-2 text-[10px] uppercase tracking-widest font-medium rounded-full border transition-all duration-300",
                        currentStatus === status 
                          ? "bg-foreground text-background border-foreground shadow-lg shadow-foreground/10" 
                          : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                      )}
                    >
                      {status.replace('_', ' ')}
                    </button>
                  ))}
                </div>
                <input type="hidden" {...register('status')} />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium" htmlFor="title">
                  Title
                </label>
                <input
                  id="title"
                  {...register('title', { required: 'A title is required' })}
                  placeholder="The essence of this task"
                  className="w-full bg-transparent border-b border-border py-2 text-xl focus:outline-none focus:border-primary transition-colors font-serif placeholder:text-muted-foreground/30"
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
                  placeholder="Depth and context..."
                  className="w-full bg-transparent border-b border-border py-2 text-lg focus:outline-none focus:border-primary transition-colors resize-none font-serif placeholder:text-muted-foreground/30"
                />
                {errors.description && (
                  <p className="text-destructive text-sm italic">{errors.description.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end items-center gap-6 pt-4">
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground transition-colors font-medium text-sm"
                onClick={onClose}
              >
                Discard Changes
              </button>
              <button
                type="submit"
                disabled={editMutation.isPending}
                className="px-8 py-3 bg-foreground text-background font-medium rounded-full hover:bg-foreground/90 transition-all active:scale-95 disabled:opacity-50"
              >
                {editMutation.isPending ? 'Updating…' : 'Save Refinements'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
