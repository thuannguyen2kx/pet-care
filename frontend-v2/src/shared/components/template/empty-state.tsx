import type { ElementType } from 'react';

type Props = {
  title: string;
  description: string;
  icon: ElementType;
};

export function EmptyState({ title, description, icon: Icon }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted mb-4 flex size-16 items-center justify-center rounded-full">
        <Icon className="text-muted-foreground size-8" />
      </div>
      <h3 className="body-bold mb-1">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
