import { useState } from "react";
import { GoGear } from "react-icons/go";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useUserData } from "../helpers/useUserDate";

export default function IssueAssignment({ assignee, issueNumber }) {
  const user = useUserData(assignee);
  const [menuOpen, setMenuOpen] = useState(false);
  const usersQuery = useQuery(["users"], () =>
    fetch("/api/users").then((res) => res.json())
  );
  const queryClient = useQueryClient();
  const setAssignment = useMutation(
    (assignee) => {
      return fetch(`/api/issues/${issueNumber}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ assignee }),
      }).then((res) => res.json());
    },
    {
      onMutate: (assignee) => {
        const oldAsignee = queryClient.getQueryData([
          "issues",
          issueNumber,
        ]).assignee;
        queryClient.setQueryData(["issues", issueNumber], (data) => ({
          ...data,
          assignee,
        }));
        return function rollback() {
          queryClient.setQueryData(["issues", issueNumber], (data) => ({
            ...data,
            assignee: oldAsignee,
          }));
        };
      },
      onError: (error, variables, rollback) => {
        rollback();
      },
      onSettled: () => {
        queryClient.invalidateQueries(["issues", issueNumber], { exact: true });
      },
    }
  );
  return (
    <div className="issue-options">
      <div>
        <span>Assignment</span>
        {user.isSuccess && (
          <div>
            <img src={user.data.profilePictureUrl} alt="user" />
            {user.data.name}
          </div>
        )}
      </div>
      <GoGear onClick={() => !usersQuery.isLoading && setMenuOpen(true)} />
      {menuOpen && (
        <div className="picker-menu">
          {usersQuery.data?.map((user) => (
            <div key={user.id} onClick={() => setAssignment.mutate(user.id)}>
              <img src={user.profilePictureUrl} alt="user" />
              {user.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
