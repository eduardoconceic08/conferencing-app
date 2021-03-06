import React from 'react';
import { IConversation } from 'pages/conversation/types';
import ConversationPrepare from 'pages/conversation/containers/conversation-prepare';
import ConversationStart from 'pages/conversation/containers/conversation-start';
import { useSelector } from 'react-redux';
import { IStore } from 'core/store/types';

interface IProps {
    conversationConfig: IConversation;
}

const ConversationWrapper: React.FC<IProps> = ({ conversationConfig }: IProps) => {
    const { user } = useSelector((state: IStore) => state.auth);

    const [isVideoPlay, setVideoPlay] = React.useState<boolean>(true);
    const [isAudiPlay, setAudioPlay] = React.useState<boolean>(true);

    if (conversationConfig.isPlaying && user) {
        return (
            <ConversationStart
                user={user}
                isAudio={isAudiPlay}
                isVideo={isVideoPlay}
            />
        );
    }
    return (
        <ConversationPrepare
            setVideo={setVideoPlay}
            setAudio={setAudioPlay}
            isAudio={isAudiPlay}
            isVideo={isVideoPlay}
        />
    );
};

export default ConversationWrapper;
