import classNames from 'classnames';
import { GridLayout } from 'components';
import { TitleSection } from './';

export default function LoadingPage() {
  const pulseClasses = 'animate-pulse bg-neutral-300 rounded-full';
  return (
    <>
      <TitleSection
        title={
          <>
            <div className={classNames(pulseClasses, 'w-1/4 h-5 mb-9')} />
            <div className={classNames(pulseClasses, 'w-11/12 mb-2 mt-2 h-12')} />
            <div className={classNames(pulseClasses, 'w-1/5 mb-2 mt-2 h-12')} />
          </>
        }
        perex={
          <div className="flex flex-col gap-2.5">
            <div className={classNames(pulseClasses, 'w-11/12 h-7')} />
            <div className={classNames(pulseClasses, 'w-full h-7')} />
            <div className={classNames(pulseClasses, 'w-5/6 h-7')} />
          </div>
        }
        grayBg={true}
      />
      <GridLayout layout={'67-33'} className="">
        <div className="flex flex-col gap-2.5 mt-5 mb-16">
          <div className={classNames(pulseClasses, 'w-11/12 h-5')} />
          <div className={classNames(pulseClasses, 'w-full h-5')} />
          <div className={classNames(pulseClasses, 'w-5/6 h-5')} />
          <div className={classNames(pulseClasses, 'w-2/4 h-4 mt-5')} />
          <div className={classNames(pulseClasses, 'w-5/6 h-5')} />
          <div className={classNames(pulseClasses, 'w-11/12 h-5')} />
          <div className={classNames(pulseClasses, 'w-5/6 h-5')} />
          <div className={classNames(pulseClasses, 'w-2/4 h-4 mt-5')} />
          <div className={classNames(pulseClasses, 'w-full h-5')} />
          <div className={classNames(pulseClasses, 'w-5/6 h-5')} />
        </div>
      </GridLayout>
    </>
  );
}
