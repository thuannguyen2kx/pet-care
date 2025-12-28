import { Spinner } from './spinner';

export const SpinnerFullScreen = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center backdrop-blur-2xl">
      <Spinner />
    </div>
  );
};
