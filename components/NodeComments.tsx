import axios from 'axios';
import classNames from 'classnames';
import { useRef, useState, useEffect } from 'react';
import { Pagination, Tag } from '@eslovensko/idsk-react';
import { format } from 'date-fns';
import { useTranslation } from 'next-i18next';

import { ScrollTo, scrollToAction } from 'components';
import { handleClientErrorToLog, parseFromDrupal } from 'utils/utils';
import { useMounted } from 'utils/useMounted';

import AccountIcon from '@eslovensko/idsk-react/dist/assets/svgIcons/Actions/account_circle.svg';
import LikeIcon from '@eslovensko/idsk-react/dist/assets/svgIcons/Actions/thumb_up.svg';
import DislikeIcon from '@eslovensko/idsk-react/dist/assets/svgIcons/Actions/thumb_down.svg';
import ArrowDown from 'public/icons/ArrowDown.svg';

export default function NodeComments({ node, dateFormat, timeFormat }) {
  const { t } = useTranslation('common');
  const commentsRef = useRef<HTMLDivElement>(null);

  const [page, setPage] = useState<number>(1);

  const [rootComments, setRootComments] = useState<Array<any>>([]);
  const [currentPageCount, setCurrentPageCount] = useState<number>(0);
  const [commentsCount, setCommentsCount] = useState<number>();

  const commentsPerPage = 5;

  useEffect(() => {
    if (!node.comments) return;

    const tempRootComment = node.comments.filter((comment) => !comment.pid?.id);
    tempRootComment.sort(function (a, b) {
      return new Date(b.created).getTime() - new Date(a.created).getTime();
    });

    let tempCount = tempRootComment.length;
    tempRootComment.forEach((rootComment) => {
      tempCount += node.comments.filter((c) => c.pid?.id === rootComment.id).length;
    });

    setRootComments(tempRootComment);
    setCurrentPageCount(Math.ceil(tempRootComment.length / commentsPerPage));
    setCommentsCount(tempCount);
  }, [node.comments]);

  function CommentsTree({ commentsToRender, margin = true, childrenVisible = false }) {
    const RootComment = ({ comment }) => {
      const [childrenOpened, setChildrenOpened] = useState<boolean>(childrenVisible);
      const relatedComments = node.comments.filter((c) => c.pid?.id === comment.id);
      relatedComments.sort(function (a, b) {
        return new Date(b.created).getTime() - new Date(a.created).getTime();
      });
      return (
        <>
          <div>
            <Comment
              author={comment.name}
              comment={comment}
              votingDisabled={false}
              dateFormat={dateFormat}
              timeFormat={timeFormat}
            />
            {!!relatedComments.length && (
              <div className="flex justify-end">
                <button
                  onClick={() => setChildrenOpened((p) => !p)}
                  className="flex items-center gap-2"
                >
                  <ArrowDown
                    className={classNames('h-1.5', {
                      'rotate-90': !childrenOpened
                    })}
                  />
                  <div>{t('comments.comments_count', { count: relatedComments.length })}</div>
                </button>
              </div>
            )}
          </div>
          {childrenOpened && (
            <CommentsTree commentsToRender={relatedComments} childrenVisible={true} />
          )}
        </>
      );
    };
    return (
      <div
        className={classNames('flex gap-7 flex-col', {
          'ml-[3.75rem]': margin
        })}
      >
        {commentsToRender.map((comment) => (
          <RootComment comment={comment} key={comment.id} />
        ))}
      </div>
    );
  }

  return (
    <div className="comments border-t border-neutral-300 mt-6">
      <ScrollTo ref={commentsRef} />
      <div className="grid relative grid-cols-1 tb1:grid-cols-2 py-7">
        <div>
          <h3>{t('comments.title_all')}</h3>
        </div>
        <div className="tb1:text-right tb1:py-2">
          {t('comments.count')}: {commentsCount}
        </div>
      </div>
      {!!rootComments.length && (
        <CommentsTree
          commentsToRender={rootComments.slice(
            (page - 1) * commentsPerPage,
            page * commentsPerPage
          )}
          margin={false}
        />
      )}

      {currentPageCount > 1 && (
        <Pagination
          className="my-8"
          pageCount={currentPageCount}
          forcePage={page}
          onPageChange={(p) => {
            scrollToAction(commentsRef);
            setPage(p.selected);
          }}
        />
      )}
    </div>
  );
}

function Comment({ author, comment, votingDisabled, dateFormat, timeFormat }) {
  const ownComment = comment.owned;
  const creationDate = format(new Date(comment.created), dateFormat + ', ' + timeFormat);

  const { t } = useTranslation('common');

  const isMounted = useMounted();
  const [loading, setLoading] = useState<'' | 'loading' | 'success' | 'blocked'>('');

  const reportComment = async () => {
    setLoading('loading');
    try {
      await axios.patch('/api/comment-report', {
        id: comment.id,
        date: Math.floor(Date.now() / 1000)
      });
      if (isMounted()) setLoading('success');
    } catch (e: any) {
      if (isMounted()) {
        if (e.response?.status === 422) {
          setLoading('blocked');
        } else {
          setLoading('');
        }
      }
      handleClientErrorToLog(e);
    }
  };

  const [currentVote, setCurrentVote] = useState<number>(comment.vote);
  const [currentLikes, setCurrentLikes] = useState<number>(comment?.votingapi_result?.likes ?? 0);
  const [currentDislikes, setCurrentDislikes] = useState<number>(
    comment?.votingapi_result?.dislikes ?? 0
  );

  const voteComment = async (type, action) => {
    try {
      await axios.post('/api/comment-vote', {
        id: comment.id,
        type: type,
        action: action
      });
    } catch (e) {
      handleClientErrorToLog(e);
    }
  };

  const LikeDislike = ({ type }: { type: 'like' | 'dislike' }) => {
    const value = type === 'like' ? 1 : -1;
    const setterCallback = (p) => (currentVote === value ? p - 1 : p + 1);

    return (
      <Tag
        label={type === 'like' ? currentLikes : currentDislikes}
        rightIcon={type === 'like' ? <LikeIcon className="h-5" /> : <DislikeIcon className="h-5" />}
        className="mr-3"
        size="small"
        selected={currentVote === value}
        disabled={currentVote === value * -1 || votingDisabled}
        onClick={() => {
          if (currentVote == value * -1 || votingDisabled) return;

          if (type === 'like') setCurrentLikes(setterCallback);
          if (type === 'dislike') setCurrentDislikes(setterCallback);

          voteComment(type, currentVote === value ? 'remove' : 'add');
          setCurrentVote((p) => (p === value ? 0 : value));
        }}
        interaction={!votingDisabled}
      />
    );
  };

  return (
    <div className="flex relative">
      <AccountIcon className="flex-none h-10 mt-2 mr-5" />
      <div>
        {comment.field_comment_censorship === false && (
          <div className="absolute right-0">
            <LikeDislike type="like" />
            <LikeDislike type="dislike" />
          </div>
        )}
        <div className="text-2xl font-semibold pt-2.5">{author ?? t('comments.redactor')}</div>
        <div className="idsk-text-body-1 text-neutral-600">
          <time dateTime={comment.created}>{creationDate}</time>{' '}
          {!!author && !ownComment && comment.field_comment_censorship === false && (
            <>
              |{' '}
              {loading === 'success' && (
                <span className="idsk-link-s no-underline text-alert-positive-dark hover:text-alert-positive-dark">
                  {t('comments.reported')}
                </span>
              )}
              {loading === 'loading' && (
                <span className="idsk-link-s no-underline text-neutral-600 hover:text-neutral-600">
                  {t('comments.report')} <span className="loading-animation">...</span>
                </span>
              )}
              {loading === 'blocked' && (
                <span className="idsk-link-s no-underline text-alert-warning hover:text-alert-warning">
                  {t('comments.report_blocked')}
                </span>
              )}
              {!loading && (
                <a tabIndex={-1} className="idsk-link-s cursor-pointer" onClick={reportComment}>
                  {t('comments.report')}
                </a>
              )}
            </>
          )}
        </div>
        <div
          className={classNames('text-lg font-medium text-slate-700 mt-2', {
            italic: comment.field_comment_censorship
          })}
        >
          {comment.field_comment_state !== 'incorrect' ? (
            <span>{parseFromDrupal(comment.comment_body?.processed)}</span>
          ) : (
            <Tag label={t('comments.incorrect_comment')} variant="warning" />
          )}
        </div>
      </div>
    </div>
  );
}
