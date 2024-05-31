import { IComment } from "../interfaces";
import { useState } from "react";

export default function Comment ({comment, handleDeleteComment}:{comment: IComment, handleDeleteComment: (id :string) => void}) {
    const [state, setState] = useState<string>("idle");
    const handleDelete = () => {
        setState("deleting");
        handleDeleteComment(comment._id);
    }

    return (
        <>
            <li className="flex flex-col gap-2 mb-6" key={comment._id}>
                <header className="flex items-center justify-between">
                    <h3 className="font-bold">
                        {comment.author === ''
                            ? 'Anonymous Commenter'
                            : comment.author}
                    </h3>
                    {new Date(comment.date).toLocaleString()}
                </header>
                <p>{comment.text}</p>
               {state==="idle" && <button
                    onClick={handleDelete}
                    className='mr-auto bg-red-300 px-2 py-1 rounded text-slate-700 font-semibold'>
                    Delete
                </button> || 
                <p>Deleting comment...</p>
                }
            </li>
            <hr />
        </>
)


}