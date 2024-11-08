import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import renderContact from '../../../Functions/methods/Application/renderContact';
import renderAknowIcon from '../../../Functions/methods/Application/renderAknowIcon';
import renderMessage from '../../../Functions/methods/Application/renderMessage';
import { VscCopy } from 'react-icons/vsc';
import { BsFillReplyFill } from 'react-icons/bs';
import { AiFillDelete } from 'react-icons/ai';

import {
    ChatArea,
    Message,
    MessageBody,
    MessageDetails,
    MessageDate,
    MessageAknow,
    MessageDateLine,
} from '../../../Assets/styled/message';
import moment from 'moment';
import { Icon } from '../../../Assets/styled/main';

function MessagesWrapper({ chatAreaRef, messages, page, setPage, contacts, user, deleteMessage }) {
    return (
        <ChatArea
            ref={chatAreaRef}
            id="scrollableDiv"
            style={{
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse',
                height: 'calc(100% - 20px)',
            }}
        >
            <InfiniteScroll
                dataLength={messages.length}
                next={() => setPage(page + 1)}
                style={{
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    height: '100%',
                    padding: '10px 30px 140px 30px',
                }}
                inverse={true}
                hasMore={true}
                loader={<p />}
                scrollableTarget="scrollableDiv"
            >
                {Array.isArray(messages) &&
                    messages.map((msg, i) => {
                        let isDateLine = false;
                        let dateLineValue = null;

                        if (i < messages.length - 1) {
                            var currentMessageDayIndex = new Date(msg.send_date).getDay();
                            var nextMessageDayIndex = new Date(messages[i + 1].send_date).getDay();
                            if (currentMessageDayIndex !== nextMessageDayIndex) {
                                isDateLine = true;
                                dateLineValue = moment(msg.send_date).calendar('');
                            }
                        }
                        if (i === messages.length - 1) {
                            isDateLine = true;
                            dateLineValue = moment(msg.send_date).calendar('');
                        }
                        return (
                            <MemoMessage
                                key={msg.id}
                                msg={msg}
                                isDateLine={isDateLine}
                                dateLineValue={dateLineValue}
                                user={user}
                                deleteMessage={deleteMessage}
                                contacts={contacts}
                            />
                        );
                    })}
            </InfiniteScroll>
        </ChatArea>
    );
}

export default MessagesWrapper;

function MessageEl({ msg, deleteMessage, isDateLine, dateLineValue, user, contacts }) {
    const text = msg.type?.startsWith('text');
    let transparent = msg?.type?.startsWith('emoji') || msg.type?.startsWith('image');
    const deleted = msg.deleted;
    if (deleted) transparent = false;

    return (
        <React.Fragment>
            <Message transparent={transparent} isMe={msg.is_me}>
                <MessageBody>
                    {msg.is_group && !msg.is_me && (
                        <p
                            style={{
                                fontSize: '14px',
                                fontWeight: 700,
                                borderRadius: '10px',
                                padding: '5px',
                                color: '#0077b6',
                            }}
                        >
                            {renderContact(msg.sender_number, contacts)}
                        </p>
                    )}
                    {(deleted && <p>Nivîs hat jêbirin</p>) || renderMessage(msg, false, user.token)}
                </MessageBody>
                <MessageDetails>
                    <div
                        style={{
                            display: 'flex',
                            width: 80,
                        }}
                    >
                        {msg.is_me && (
                            <MessageAknow>
                                <img
                                    alt="ak"
                                    src={renderAknowIcon(msg)}
                                    width={14}
                                    height={14}
                                    style={{ height: 14, width: 14 }}
                                />
                            </MessageAknow>
                        )}
                        <MessageDate>{moment(msg.send_date).format('h:mm a')}</MessageDate>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            marginRight: 20,
                        }}
                    >
                        {!deleted && (
                            <>
                                <Icon
                                    style={{
                                        height: 20,
                                        width: 20,
                                    }}
                                    onClick={() =>
                                        deleteMessage({
                                            uid: msg.uid,
                                            reciever_number: msg.reciever_number,
                                            is_group: msg.is_group,
                                            group_id: msg.group_id,
                                        })
                                    }
                                >
                                    <AiFillDelete size={13} color={'#999'} />
                                </Icon>
                                {!transparent && (
                                    <Icon
                                        style={{
                                            height: 20,
                                            width: 20,
                                        }}
                                    >
                                        <BsFillReplyFill size={13} color={'#999'} />
                                    </Icon>
                                )}

                                {text && (
                                    <Icon
                                        onClick={() => {
                                            navigator.clipboard.writeText(msg.text);
                                        }}
                                        style={{
                                            height: 20,
                                            width: 20,
                                        }}
                                    >
                                        <VscCopy size={12} color="#999" />
                                    </Icon>
                                )}
                            </>
                        )}
                    </div>
                </MessageDetails>
            </Message>
            {isDateLine && <MessageDateLine>{dateLineValue}</MessageDateLine>}
        </React.Fragment>
    );
}

export const MemoMessage = React.memo(MessageEl, (p, n) => {
    if (p.msg.reciever_number !== n.msg.reciever_number) {
        return false;
    }
    if (p.msg.is_read !== n.msg.is_read) {
        return false;
    }
    if (p.msg.is_recieved !== n.msg.is_recieved) {
        return false;
    }
    if (p.msg.is_pending !== n.msg.is_pending) {
        return false;
    }

    if (p.msg.deleted !== n.msg.deleted) {
        return false;
    }
    if (p.msg.send_date !== n.msg.send_date) {
        return false;
    }
    if (p.msg.file_id !== n.msg.file_id) {
        return false;
    }
    return true;
});

// <React.Fragment key={msg.id}>
// <Message transparent={transparent} isMe={msg.is_me}>
//   <MessageBody>
//     {msg.is_group && !msg.is_me && (
//       <p
//         style={{
//           fontSize: '14px',
//           fontWeight: 700,
//           borderRadius: '10px',
//           padding: '5px',
//           color: '#0077b6',
//         }}
//       >
//         {renderContact(msg.sender_number, contacts)}
//       </p>
//     )}
//     {(deleted && <p>Nivîs hat jêbirin</p>) ||
//       renderMessage(msg, false, user.token)}
//   </MessageBody>
//   <MessageDetails>
//     <div
//       style={{
//         display: 'flex',
//         width: 80,
//       }}
//     >
//       {msg.is_me && (
//         <MessageAknow>
//           <img
//             alt="ak"
//             src={renderAknowIcon(msg)}
//             width={14}
//             height={14}
//             style={{ height: 14, width: 14 }}
//           />
//         </MessageAknow>
//       )}
//       <MessageDate>
//         {moment(msg.send_date).format('h:mm a')}
//       </MessageDate>
//     </div>

//     <div
//       style={{
//         display: 'flex',
//         marginRight: 20,
//       }}
//     >
//       {!deleted && (
//         <>
//           <Icon
//             style={{
//               height: 20,
//               width: 20,
//             }}
//             onClick={() =>
//               handleDeleteMessage({
//                 uid: msg.uid,
//                 reciever_number: msg.reciever_number,
//                 is_group: msg.is_group,
//                 group_id: msg.group_id,
//               })
//             }
//           >
//             <AiFillDelete size={13} color={'#999'} />
//           </Icon>
//           {!transparent && (
//             <Icon
//               style={{
//                 height: 20,
//                 width: 20,
//               }}
//             >
//               <BsFillReplyFill size={13} color={'#999'} />
//             </Icon>
//           )}

//           {text && (
//             <Icon
//               onClick={() => {
//                 navigator.clipboard.writeText(msg.text);
//               }}
//               style={{
//                 height: 20,
//                 width: 20,
//               }}
//             >
//               <VscCopy size={12} color="#999" />
//             </Icon>
//           )}
//         </>
//       )}
//     </div>
//   </MessageDetails>
// </Message>
// {isDateLine && (
//   <MessageDateLine>{dateLineValue}</MessageDateLine>
// )}
// </React.Fragment>
