import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CodeEditor from '../components/CodeEditor';
import TTSPlayer from '../components/TTSPlayer';

const LessonDetail = () => {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    fetch(`/api/lessons/${id}`)
      .then(res => res.json())
      .then(data => setLesson(data));
  }, [id]);

  if (!lesson) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-2">{lesson.title}</h2>
      <TTSPlayer text={lesson.content} />
      <p className="mt-4 whitespace-pre-line">{lesson.content}</p>
      <CodeEditor />
    </div>
  );
};

export default LessonDetail;
