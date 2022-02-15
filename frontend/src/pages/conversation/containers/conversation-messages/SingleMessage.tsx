import React from 'react';
import { SingleMessageStyled } from './style';
import { IUser } from 'core/types';

interface IProps {
    message: string;
    author: string;
    date: string;
    isFile: boolean;
    user: IUser;
}

const SingleMessage: React.FC<IProps> = (props: IProps) => {
    const {
        message, author, date, isFile, user,
    } = props;

    return (
        <SingleMessageStyled isCurrentUser={user.email === author}>
            <div className="header">
                <span className="author">{author}</span>
                <span className="date">{date}</span>
            </div>
            {isFile ? (
                <img className="content" src={message} alt={message} />
            ) : (
                <p className="content">{message}</p>
            )}
        </SingleMessageStyled>
    );
};

export default SingleMessage;
