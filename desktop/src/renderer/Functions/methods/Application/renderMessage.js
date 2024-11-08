import { useState } from 'react';
import useLoad from '../../hooks/useLoad';
import {
  FaFileArchive,
  FaFileWord,
  FaFileExcel,
  FaFilePdf,
} from 'react-icons/fa';
import { AiFillLike, AiOutlineCloudDownload } from 'react-icons/ai';
import { FcLike } from 'react-icons/fc';
import LoadSpinner from '../../../Components/LoadSpinner';
import Modal from '../../../Components/Modal';
import { MAIN_COLOR } from '../../../Assets/styled/colors';
const fileIcons = {
  'application/x-zip-compressed': <FaFileArchive size={40} color={'#242423'} />,
  'application/zip': <FaFileArchive size={40} color={'#242423'} />,
  'application/vnd.ms-excel': <FaFileExcel size={40} color={'#242423'} />,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': (
    <FaFileExcel size={40} color={'#242423'} />
  ),
  'application/x-rar-compressed': <FaFileArchive size={40} color={'#242423'} />,
  'application/vnd.rar': <FaFileArchive size={40} color={'#242423'} />,
  'application/x-rar': <FaFileArchive size={40} color={'#242423'} />,
  'application/msword': <FaFileWord size={40} color={'#3a86ff'} />,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': (
    <FaFileWord size={40} color={'#3a86ff'} />
  ),
  'application/pdf': <FaFilePdf size={40} color={'#242423'} />,
};
export default function renderMessageBody(msg, isMenu, token) {
  let you = 'أنت :';
  switch (msg.type) {
    case 'text':
      return isMenu ? msg.text?.slice(0, 13) + ' . . ' : renderText(msg);

    case 'like':
      return isMenu ? (
        <AiFillLike size={14} color={'#d8a48f'} />
      ) : (
        <AiFillLike
          style={{
            boxShadow: '0 3px 10px rgb(0 0 0 / 1)',
            zIndex: 10,
          }}
          size={45}
          color={'#d8a48f'}
        />
      );

    case 'emoji/like':
      return isMenu ? (
        <AiFillLike size={14} color={'#d8a48f'} />
      ) : (
        <AiFillLike size={45} color={'#d8a48f'} />
      );

    case 'emoji/love':
      return isMenu ? (
        <FcLike size={14} color={MAIN_COLOR} />
      ) : (
        <FcLike size={45} color={MAIN_COLOR} />
      );

    case 'application/x-zip-compressed':
      return isMenu ? 'rar' : <RenderFile msg={msg} token={token} />;

    case 'video/webm':
      return isMenu ? 'تسجيل صوتي' : <RenderRecord msg={msg} token={token} />;

    case 'application/zip':
      return isMenu ? 'ملف مضغوط' : <RenderFile msg={msg} token={token} />;

    case 'application/vnd.ms-excel':
      return isMenu ? 'ملف اكسل' : <RenderFile msg={msg} token={token} />;

    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return isMenu ? 'ملف اكسل' : <RenderFile msg={msg} token={token} />;

    case 'application/x-rar-compressed':
      return isMenu ? 'ملف مضغوط' : <RenderFile msg={msg} token={token} />;

    case 'application/vnd.rar':
      return isMenu ? 'ملف مضغوط' : <RenderFile msg={msg} token={token} />;

    case 'application/x-rar':
      return isMenu ? 'ملف مضغوط' : <RenderFile msg={msg} token={token} />;

    case 'application/msword':
      return isMenu ? 'ملف وورد' : <RenderFile msg={msg} token={token} />;

    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return isMenu ? 'ملف وورد' : <RenderFile msg={msg} token={token} />;

    case 'image/png':
      return isMenu ? 'ملف صورة' : <RenderImage msg={msg} token={token} />;

    case 'image/jpg':
      return isMenu ? 'ملف صورة' : <RenderImage msg={msg} token={token} />;

    case 'image/jpeg':
      return isMenu ? 'ملف صورة' : <RenderImage msg={msg} token={token} />;

    case 'application/pdf':
      return isMenu ? 'ملف pdf' : <RenderFile msg={msg} token={token} />;

    case 'video/mp4':
      return isMenu ? 'ملف mp4' : <RenderFile msg={msg} token={token} />;

    default:
      return isMenu ? 'ملف ' : <RenderFile msg={msg} token={token} />;
  }
}

function renderText(msg) {
  const msgs = renderMessage(msg.text);
  return (
    <div
      style={{
        userSelect: 'text',
      }}
    >
      {msgs.map((m, i) => {
        if (m.empty) return <br key={i} />;

        return (
          <div
            style={{
              userSelect: 'text',
              textAlign: m.dir === 'l' ? 'left' : 'right',
            }}
            key={i}
          >
            {m.text}
          </div>
        );
      })}
    </div>
  );
}

function FileIcon({ type }) {
  const icon = fileIcons[type];
  return icon;
}

function RenderRecord({ msg, token }) {
  const { isLoading, error, data, progress } = useLoad(msg, token);
  if (isLoading) {
    return <p>جاري التحميل</p>;
  }
  if (error) {
    return null;
  }
  if (data) {
    const href = URL.createObjectURL(data);
    return (
      <audio controls>
        <source src={href} type="video/webm" />
      </audio>
    );
  }
}
function renderSize(bytes) {
  if (bytes < 1024) return bytes + ' bytes';
  if (bytes > 1024 && bytes < 1024 * 1024)
    return (bytes / 1024).toFixed(2) + 'Kb';
  return (bytes / 1024 / 1024).toFixed(2) + 'Mb';
}

function RenderFile({ msg, token }) {
  const { isLoading, error, data, progress } = useLoad(msg, token);

  function renderData() {
    const href = URL.createObjectURL(data);

    return (
      <div>
        <a
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
          }}
          download={msg.file_name}
          href={href}
        >
          <span style={{ margin: '0 0px 0 10px', color: '#ff9f1c' }}>
            Save - حفظ
          </span>{' '}
          <AiOutlineCloudDownload color="#ff9f1c" size={26} />
        </a>
      </div>
    );
  }

  function renderLoading() {
    return <LoadSpinner percentage={progress} />;
  }
  function renderError() {
    return <p>error</p>;
  }

  return (
    <div style={{ minWidth: 200 }}>
      {/* <FileIcon type={data.type} /> */}
      <p style={{ color: '#ef476f' }}> ملف مرفق </p>
      <span>الحجم :</span>

      <span style={{ color: '#232424', margin: '0 10px 0 10px' }}>
        {renderSize(msg.size)}
      </span>
      <br />
      <span>اسم الملف :</span>
      <span style={{ margin: '0 10px 0 10px' }}>{msg.file_name}</span>
      <div>
        {data && renderData()}
        {isLoading && renderLoading()}
      </div>

      {error && renderError()}
    </div>
  );
}
function RenderImage({ msg, token }) {
  const { isLoading, error, data, progress } = useLoad(msg, token);
  const [isModalOpened, setIsModalOpened] = useState(false);
  function onImageClick() {
    setIsModalOpened(true);
  }

  if (isLoading) {
    return <img className="img-ms" alt="ms" width="400" />;
  }
  if (error) {
    return;
  }
  if (data) {
    const href = URL.createObjectURL(data);

    function renderData() {
      return (
        <div>
          <a
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
            }}
            download={msg.file_name}
            href={href}
          >
            <span style={{ margin: '0 0px 0 10px', color: '#ff9f1c' }}>
              Save - حفظ
            </span>{' '}
            <AiOutlineCloudDownload color="#ff9f1c" size={26} />
          </a>
        </div>
      );
    }
    return (
      <>
        <Modal
          is_opened={isModalOpened}
          close_modal={() => setIsModalOpened(false)}
          header={''}
          height={'90%'}
          width={'90%'}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 60,
              backgroundColor: '#888888',
              padding: 20,
              height: '100%',
            }}
          >
            <img
              alt="ms"
              src={href}
              width="90%"
              height={'90%'}
              onClick={onImageClick}
            />
          </div>
        </Modal>
        <img
          alt="ms"
          style={{
            overflow: 'hidden',
          }}
          src={href}
          className="img-ms"
          onClick={onImageClick}
        />
        {renderData()}
      </>
    );
  }
}

// new
function isSpacesOnly(str) {
  return str.length !== 0 && str.trim().length === 0;
}

function isEmptyString(str) {
  return str.length === 0;
}

function isLatinLetter(letter) {
  return /[a-zA-ZÊêÎŞÛûḦḧÇçîşÜü]/.test(letter);
}

function isStartsWithLatin(str) {
  const firtsLetter = str.trim()[0];
  return isLatinLetter(firtsLetter);
}

function renderMessage(msg) {
  const linesArray = msg.split('\n');
  let result = [];

  linesArray.forEach((line) => {
    if (isEmptyString(line) || isSpacesOnly(line)) {
      result.push({ text: line, dir: 'l', empty: true });
      return;
    }
    if (isStartsWithLatin(line)) {
      result.push({ text: line, dir: 'l' });
    } else {
      result.push({ text: line, dir: 'r' });
    }
  });
  return result;
}
