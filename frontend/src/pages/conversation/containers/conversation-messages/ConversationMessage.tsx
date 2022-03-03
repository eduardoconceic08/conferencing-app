import React from 'react';
import { ConversationMessageStyles, SidebarStyled } from './style';
import { Button, Input, Tabs } from 'antd';
import SingleMessage from 'pages/conversation/containers/conversation-messages/SingleMessage';
import { IMessage, IUser, IUserList } from 'core/types';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { IStore } from 'core/store/types';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { addRoomImagePost } from 'core/api/commands';
import { useParams } from 'react-router-dom';
import Picker from 'emoji-picker-react';
import { PaperClipOutlined, SmileOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import useOutsideClick from 'custom--hooks/useOutsideClick';
import UserList from 'pages/conversation/components/user-list';

interface IProps {
    isMessagesOpen: boolean;
    user: IUser;
    userList: IUserList[]
}

declare global {
    interface Window {
        stream: any;
    }
}

const { TabPane } = Tabs;

const ConversationMessage = React.forwardRef(
    (
        props: IProps,
        socketRef: React.MutableRefObject<SocketIOClient.Socket | null>,
    ) => {
        const { isMessagesOpen, user, userList } = props;

        const [inputValue, setInputValue] = React.useState<string>('');
        const [messages, setMessages] = React.useState<IMessage[]>([]);
        const [isTyping, setTyping] = React.useState<string>('');
        const [isEmojiVisible, setEmojiVisible] = React.useState<boolean>(false);

        const { slug } = useParams();
        const { t } = useTranslation();

        const buttonRef = React.useRef<HTMLButtonElement>(null);
        const divRef = React.useRef<HTMLDivElement>(null);

        useOutsideClick(isEmojiVisible, [divRef, buttonRef], () =>
            setEmojiVisible(false));

        const onDrop = React.useCallback((acceptedFiles) => {
            acceptedFiles.forEach(async (file) => {
                if (!socketRef.current) return;
                const formData = new FormData();
                formData.append('file', file);
                formData.append('file_name', file.name);
                const { resultPath, type } = await addRoomImagePost(slug, formData);
                const newMessage: IMessage = {
                    author: user.email,
                    date: moment().format('DD.MM.YYYY, HH:mm'),
                    message: process.env.API_HOST + resultPath,
                    isImage: type === 'image',
                    resultPath,
                    isPdf: type === 'pdf',
                };
                setMessages((prev) => [...prev, newMessage]);
                socketRef.current.emit('send-message', newMessage);
                setInputValue('');
            });
        }, []);

        const { getRootProps, getInputProps, isDragActive } = useDropzone({
            onDrop,
        });

        let typingTimer;

        React.useEffect(() => {
            if (!socketRef.current) return;
            socketRef.current.on('receive-message', (data: IMessage) => {
                setMessages((prev) => [...prev, data]);
            });

            socketRef.current.on('receive-is-typing', (email: string) => {
                setTyping(email);
                clearTimeout(typingTimer);
                typingTimer = setTimeout(() => {
                    setTyping('');
                }, 7000);
            });
        }, [socketRef]);

        const handleChange = (event) => {
            if (!socketRef.current || !user) return;
            setInputValue(event.target.value);
            socketRef.current.emit('send-is-typing', user.email);
        };

        const sendMessage = () => {
            if (inputValue.length <= 0 || !user || !socketRef.current) return;
            const newMessage: IMessage = {
                author: user.email,
                date: moment().format('DD.MM.YYYY, HH:mm'),
                message: inputValue,
                isPdf: false,
                isImage: false,
            };
            setMessages((prev) => [...prev, newMessage]);
            socketRef.current.emit('send-message', newMessage);
            setInputValue('');
        };

        const onKeyDown = (event: React.KeyboardEvent) => {
            if (event.key !== 'Enter') return;
            event.preventDefault();
            sendMessage();
        };

        const onEmojiClick = (event, emojiObject) => {
            setInputValue((prev) => prev + emojiObject.emoji);
        };

        const emitReport = () => {
            if (!socketRef.current) return;
            socketRef.current.emit('report-reply-server', (user.email));
        };

        return (
            <SidebarStyled isOpen={isMessagesOpen}>
                <Tabs defaultActiveKey="1" style={{ width: '350px', background: '#212121' }}>
                    <TabPane tab={t('common.users')} key="1">
                        <UserList userList={userList} handleClick={emitReport} />
                    </TabPane>
                    <TabPane tab={t('common.messages')} key="2" style={{ height: '100%' }}>
                        <ConversationMessageStyles isEmojiVisible={isEmojiVisible}>
                            <div
                                className="messages--wrapper"
                                {...getRootProps({
                                    onClick: (event) => event.stopPropagation(),
                                })}
                            >
                                {messages.map((message, idx) => (
                                    <SingleMessage
                                        user={user}
                                        key={idx}
                                        message={message.message}
                                        author={message.author}
                                        date={message.date}
                                        isPdf={message.isPdf}
                                        isImage={message.isImage}
                                        resultPath={message.resultPath}
                                    />
                                ))}
                                {isTyping && (
                                    <div className="is--typing">
                                        {`${isTyping} ${t('common.isWriting')}`}
                                    </div>
                                )}
                            </div>
                            <div className="send--wrapper">
                                <TextArea
                                    value={inputValue}
                                    onChange={handleChange}
                                    onKeyDown={onKeyDown}
                                    autoSize
                                />
                                <div className="emoi">
                                    <button
                                        className="ant-btn"
                                        type="button"
                                        onClick={() =>
                                            setEmojiVisible((prev) => !prev)}
                                    >
                                        <SmileOutlined />
                                    </button>
                                    <div className="picker" ref={divRef}>
                                        <Picker
                                            onEmojiClick={onEmojiClick}
                                            disableSearchBar
                                            disableAutoFocus
                                        />
                                    </div>
                                </div>
                                <button
                                    className="ant-btn"
                                    type="button"
                                    {...getRootProps()}
                                    ref={buttonRef}
                                >
                                    <input {...getInputProps()} />
                                    <PaperClipOutlined />
                                </button>
                                <Button
                                    className=""
                                    type="primary"
                                    onClick={sendMessage}
                                >
                                    {t('common.send')}
                                </Button>
                            </div>
                        </ConversationMessageStyles>
                    </TabPane>
                </Tabs>
            </SidebarStyled>
        );
    },
);

export default ConversationMessage;
