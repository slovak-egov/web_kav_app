// import React from 'react';
// import { useRouter } from 'next/router';
// import Feedback from '@skit-feedback/feedback-form/dist/Feedback';

// const FeedbackCmp = (props: any) => {
//   const { locale, defaultLocale } = useRouter();
//   const showFeedback = process.env.SHOW_FEEDBACK === 'true';
//   const feedbackLocale = ['sk', 'en'].includes(locale ?? '') ? locale : defaultLocale;

//   return (
//     <>
//       {showFeedback && !!props.configurationItemId && (
//         <Feedback {...props} useCaptcha lang={feedbackLocale as string} />
//       )}
//     </>
//   );
// };

// export default FeedbackCmp;

import React from 'react';
import FeedbackForm from '@skit-feedback/feedback-form';
import { useRouter } from 'next/router';

const Feedback = (props) => {
  const { locale, defaultLocale } = useRouter();
  const showFeedback = process.env.NEXT_PUBLIC_SHOW_FEEDBACK === 'true';
  const feedbackLocale = ['sk', 'en'].includes(locale ?? '') ? locale : defaultLocale;

  return (
    <>
      {showFeedback && !!props.configurationItemId && (
        <FeedbackForm {...props} useCaptcha lang={feedbackLocale} />
      )}
    </>
  );
};

export default Feedback;
