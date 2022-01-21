import React from 'react';

// styles
import { InputRoomStyled, SingleRoomStyled } from './styles';

// icons
import { CopyOutlined } from '@ant-design/icons';

// components
import { notification } from 'antd';

// hooks
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

// types
import { ISingleRoom } from 'core/types';

interface IProps {
    singleRoom: ISingleRoom;
}

const SingleRoom: React.FC<IProps> = ({ singleRoom }: IProps) => {
    const { roomCode, name, id } = singleRoom;

    const spanRef = React.useRef<HTMLInputElement>(null);

    const { t } = useTranslation();
    const history = useHistory();

    const handleOpenModal = () => {
        console.log('Open Modal');
    };

    const handleStartMeet = () => {
        history.push(`/conversation/${roomCode}`);
    };

    const handleCopy = async () => {
        if (!spanRef || !spanRef.current) return;
        await navigator.clipboard.writeText(roomCode);
        notification.info({
            message: t('messages.copyClipboard'),
            description: spanRef.current.value,
            placement: 'topLeft',
            duration: 2,
        });
    };

    return (
        <SingleRoomStyled>
            <div className="title--wrapper">
                <span className="title">{name}</span>
            </div>
            <InputRoomStyled>
                <span
                    className="ant-btn title"
                    ref={spanRef}
                    onClick={handleOpenModal}
                >
                    {roomCode}
                </span>
                <button
                    type="button"
                    className="btn-copy ant-btn ant-btn-ghost"
                    onClick={handleCopy}
                >
                    <CopyOutlined />
                </button>
                <button
                    type="button"
                    className="btn-visit ant-btn ant-btn-primary"
                    onClick={handleStartMeet}
                >
                    {t('common.visit')}
                </button>
            </InputRoomStyled>
        </SingleRoomStyled>
    );
};

export default SingleRoom;
