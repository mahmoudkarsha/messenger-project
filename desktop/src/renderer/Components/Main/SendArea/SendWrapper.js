import React, { useState, useRef } from 'react';
import {
  AiOutlineCloudUpload,
  AiOutlineSend,
  AiOutlineLike,
  AiOutlineDelete,
  AiOutlineCloseCircle,
} from 'react-icons/ai';

import {
  BsEnvelopeFill,
  BsMic,
  BsRecordCircle,
  BsEmojiSmile,
  BsCloudUpload,
} from 'react-icons/bs';
import { FcLike } from 'react-icons/fc';
import { FaWindowClose } from 'react-icons/fa';
import { GrLike, GrCloudUpload } from 'react-icons/gr';
import {
  NewMessageInput,
  SendingArea,
  Icon,
  FileName,
  FlexCenterDiv,
  RecordTime,
  EmojiContaciner,
} from '../../../Assets/styled/main';
import Modal from '../../Modal';
import emoji from './emoji';

let initialMessage = {
  type: 'text',
  body: null,
  file_name: '',
  size: 0,
  text: '',
};

const allowedTypes = [
  'application/zip',
  'application/x-rar',
  'application/vnd.rar',
  'application/x-rar-compressed',
  'application/x-zip-compressed',
  'image/png',
  'image/jpg',
  'image/jpeg',
  'video/mp4',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/pdf',
  'audio/mp3',
];
let d = 0;
const acceptFiles = allowedTypes.join(', ');

function SendWrapper({ sendMessage, typing }) {
  const [isEmojiPanelOpened, setIsEmojiPanelOpened] = useState(false);
  const [message, setMsg] = useState(initialMessage);
  const [error, setError] = useState('');
  const [isErrorModalOpened, setIsErrorModalOpened] = useState(false);
  //record states

  const [isRecording, setIsRecording] = useState(false);
  const [type, setType] = useState('');
  const [stream, setStream] = useState(null);
  const mediaRecorderRef = useRef();
  const chunks = useRef([]);
  const uploadFileRef = useRef();
  const onFileInputChange = async (e, state) => {
    const file =
      state === 'drop' ? e.dataTransfer.files[0] : e?.target.files[0];
    if (file.size > 1024 * 1024 * 200 * 10) {
      setError('حجم الملف أكبر من 200 ميغابايت');
      setIsErrorModalOpened(true);
      return;
    }
    const fileBuffer = await file.arrayBuffer();
    const unit8arr = new Uint8Array(fileBuffer.slice(0, 7));
    let typeFromBuffer = null;

    if (
      unit8arr[0] === 82 &&
      unit8arr[1] === 97 &&
      unit8arr[2] === 114 &&
      unit8arr[3] === 33
    ) {
      typeFromBuffer = 'application/x-rar-compressed';
    }

    if (
      unit8arr[0] === 37 &&
      unit8arr[1] === 80 &&
      unit8arr[2] === 68 &&
      unit8arr[3] === 70
    ) {
      typeFromBuffer = 'application/pdf';
    }

    const type = typeFromBuffer ? typeFromBuffer : file.type;
    if (!allowedTypes.includes(type)) {
      setError('غير مسموح بارسال هذا النوع من الملفات');
      setIsErrorModalOpened(true);
      return;
    }
    setMsg({
      type,
      body: file,
      text: '',
      size: file.size,
      file_name: file.name,
    });
  };

  const onLikeClick = () => {
    sendMessage({ type: 'emoji/like' });
  };

  const onNewMessageSend = () => {
    if (message.type === 'text' && message.text.length > 10000) {
      setError('الرسالة أطول من الحد المسموح');
      setIsErrorModalOpened(true);
      return;
    }
    if (
      (message.type === 'text' && message.text.length === 0) ||
      message.text.startsWith('\n')
    )
      return;
    sendMessage(message);
    setMsg(initialMessage);
  };

  const onUploadIconClick = () => {
    if (uploadFileRef && uploadFileRef.current) {
      uploadFileRef.current.value = null;
      uploadFileRef.current.click();
    }
  };

  function onDataAvailable(ev) {
    chunks.current = [ev.data];
  }

  function onStop(ev) {
    if (d === 1) {
      d = 0;
      return;
    }
    if (!chunks.current.length) return;
    const soundBlob = new Blob(chunks.current, { type });
    sendMessage({
      type: 'video/webm',
      body: soundBlob,
      text: '',
      size: soundBlob.size,
      file_name: Math.random() + 'r',
    });
  }
  const onRecordClick = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      setIsRecording(false);
      stream.getTracks().forEach((track) => track.stop());
      return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true }).then((soundStream) => {
      setStream(soundStream);
      mediaRecorderRef.current = new MediaRecorder(soundStream, {});

      if (mediaRecorderRef.current.state === 'inactive') {
        mediaRecorderRef.current.start();
        setIsRecording(true);
      }

      mediaRecorderRef.current.ondataavailable = onDataAvailable;
      mediaRecorderRef.current.onstop = onStop;
      mediaRecorderRef.current.onerror = (e) => {};
    });
  };

  return (
    <SendingArea>
      <Modal
        is_opened={isErrorModalOpened}
        close_modal={() => setIsErrorModalOpened(false)}
        header={'خطأ'}
        height={'200px'}
        width={'400px'}
      >
        <FlexCenterDiv
          style={{ height: '100%', width: '100%', justifyContent: 'center' }}
        >
          <p style={{ color: 'red', fontSize: '1.5vw' }}>{error}</p>
        </FlexCenterDiv>
      </Modal>
      {message.file_name && (
        <FileName>
          <div
            onClick={() => {
              setMsg({ ...initialMessage });
            }}
            style={{ position: 'absolute', top: 10, left: 20 }}
          >
            <FaWindowClose size={18} color="red" />
          </div>
          {message.file_name}
        </FileName>
      )}

      <div
        style={{
          width: 'calc(100% - 180px)',
          height: 70,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {!isRecording && (
          <NewMessageInput
            onKeyDown={(e) => {
              if (e.shiftKey && (e.key === 'Enter' || e.key === 13)) {
                e.preventDefault();
                setMsg((ps) => {
                  return { ...ps, text: ps.text + '\n' };
                });

                return;
              }
              if (e.key === 'Enter' || e.key === 13) {
                e.preventDefault();
                onNewMessageSend();
                return;
              }
            }}
            value={message.text}
            onChange={(e) => {
              setMsg((ps) => {
                return { ...ps, text: e.target.value };
              });
              typing();
            }}
            style={{}}
            onDrop={(e) => {
              // return;
              onFileInputChange(e, 'drop');
            }}
          />
        )}

        <input
          style={{
            display: 'none',
          }}
          ref={uploadFileRef}
          type="file"
          accept={acceptFiles}
          onChange={onFileInputChange}
        />
      </div>

      <div
        style={{
          display: 'flex',
          width: 180,
        }}
      >
        {((message.text || message.file_name) && (
          <Icon onClick={onNewMessageSend}>
            <AiOutlineSend size={23} color="#00BFA6" />
          </Icon>
        )) || (
          <Icon
            onClick={onRecordClick}
            style={{
              color: isRecording ? 'red' : '#ffb703',
              transition: '0.3s ease-in-out',
            }}
          >
            {(isRecording && <BsRecordCircle size={23} />) || (
              <BsMic size={23} />
            )}
          </Icon>
        )}
        {(isRecording && (
          <Icon
            onClick={() => {
              if (mediaRecorderRef.current?.state === 'recording') {
                setIsRecording(false);
                mediaRecorderRef.current = null;
                d = 1;
                stream.getTracks().forEach((track) => track.stop());
              }
            }}
          >
            <AiOutlineDelete color="#00BFA6" size={23} />
          </Icon>
        )) || (
          <>
            <Icon style={{ position: 'relative' }}>
              <EmojiContaciner display={isEmojiPanelOpened ? 'block' : 'none'}>
                {emoji.map((em) => {
                  return (
                    <span
                      style={{
                        fontSize: 23,
                      }}
                      key={em}
                      onClick={() => {
                        setMsg({ ...message, text: message.text + em });
                      }}
                    >
                      {em}
                    </span>
                  );
                })}
              </EmojiContaciner>
              {(isEmojiPanelOpened && (
                <AiOutlineCloseCircle
                  onClick={() => setIsEmojiPanelOpened(false)}
                  color="#00BFA6"
                  size={27}
                />
              )) || (
                <BsEmojiSmile
                  onClick={() => setIsEmojiPanelOpened(true)}
                  color="#00BFA6"
                  size={23}
                />
              )}
            </Icon>
            <Icon onClick={onLikeClick}>
              <AiOutlineLike color="#00BFA6" size={23} />
            </Icon>
          </>
        )}

        {!isRecording && (
          <Icon onClick={onUploadIconClick}>
            <AiOutlineCloudUpload color="#5d576b" size={23} />
          </Icon>
        )}
      </div>
    </SendingArea>
  );
}

export default SendWrapper;
