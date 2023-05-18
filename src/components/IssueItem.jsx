import { GoComment, GoIssueClosed, GoIssueOpened } from "react-icons/go";
import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import fetchWithError from "../helpers/fetchWithError";
import { relativeDate } from "../helpers/relativeDate";
import { useUserData } from "../helpers/useUserDate";
import { Label } from "./Label";

export function IssueItem({
  title,
  number,
  assignee,
  commentCount,
  createdBy,
  createdDate,
  labels,
  status,
}) {
  const assigneeUser = useUserData(assignee);
  const createdByUser = useUserData(createdBy);
  const queryClient = useQueryClient();
  return (
    <li
      onMouseEnter={() => {
        queryClient.prefetchQuery(["issues", number.toString()], () =>
          fetchWithError(`/api/issues/${number}`)
        );
        queryClient.prefetchInfiniteQuery(["issues", number.toString()], () =>
          fetchWithError(`/api/issues/${number}/comments?page=1`)
        );
      }}
    >
      <div>
        {status === "done" || status === "cancelled" ? (
          <GoIssueClosed style={{ color: "red" }} />
        ) : (
          <GoIssueOpened style={{ color: "green" }} />
        )}
      </div>
      <div className="issue-content">
        <span>
          <Link to={`/issue/${number}`}>{title}</Link>
          {labels.map((label) => (
            <Label key={label} label={label} />
          ))}
        </span>
        <small>
          #{number} opened {relativeDate(createdDate)}{" "}
          {createdByUser.isSuccess ? `by ${createdByUser.data.name}` : ""}
        </small>
      </div>
      {assignee ? (
        <img
          src={
            assigneeUser.isSuccess ? assigneeUser.data.profilePictureUrl : ""
          }
          alt={`Assigned to ${
            assigneeUser.isSuccess ? assigneeUser.data.name : "avatar"
          }`}
          className="assigned-to"
        />
      ) : null}
      <span className="comment-count">
        {commentCount > 0 ? (
          <>
            <GoComment />
            {commentCount}
          </>
        ) : null}
      </span>
    </li>
  );
}
