
import React, { useState, useEffect, useCallback } from 'react';
import Card from './components/Card';
import FileUploadTrigger from './components/FileUploadTrigger';
import FileDisplay from './components/FileDisplay';
import UploadCloudIcon from './components/icons/UploadCloudIcon';
import PhotographIcon from './components/icons/PhotographIcon';
import DocumentTextIcon from './components/icons/DocumentTextIcon';

const App: React.FC = () => {
  console.log('App component rendering/re-rendering...');

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [selectedGenericFiles, setSelectedGenericFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  console.log(
    'Current state - selectedImages:', selectedImages.map(f => f.name),
    'selectedGenericFiles:', selectedGenericFiles.map(f => f.name),
    'imagePreviewUrls:', imagePreviewUrls
  );

  // Effect for managing image preview URLs
  useEffect(() => {
    console.log('[useEffect selectedImages] Triggered. Current selectedImages:', selectedImages.map(f => f.name));

    // Create new object URLs for the current selectedImages
    const newUrls = selectedImages.map(file => {
      const url = URL.createObjectURL(file);
      console.log(`[useEffect selectedImages] Created URL ${url} for ${file.name}`);
      return url;
    });

    setImagePreviewUrls(newUrls);
    console.log('[useEffect selectedImages] Set imagePreviewUrls to:', newUrls);

    // Cleanup function: This is crucial.
    // It will run when the component unmounts or before the effect runs again
    // (i.e., when selectedImages changes).
    // It revokes the URLs that were created in *this* specific effect run.
    return () => {
      console.log('[useEffect selectedImages Cleanup] Revoking URLs created in this effect run:', newUrls);
      newUrls.forEach(url => {
        URL.revokeObjectURL(url);
        console.log(`[useEffect selectedImages Cleanup] Revoked ${url}`);
      });
    };
  }, [selectedImages]); // Only dependency is selectedImages

  const handleImageSelect = (files: FileList | null) => {
    console.log('[handleImageSelect] Called. Received FileList:', files);
    if (files && files.length > 0) {
      const newFilesArray = Array.from(files);
      console.log('[handleImageSelect] New files array:', newFilesArray.map(f => f.name));
      setSelectedImages(prevImages => {
        console.log('[handleImageSelect] setSelectedImages updater - Previous selectedImages:', prevImages.map(f => f.name));
        const updatedImages = [...prevImages, ...newFilesArray];
        console.log('[handleImageSelect] setSelectedImages updater - Updated selectedImages:', updatedImages.map(f => f.name));
        return updatedImages;
      });
      setFeedbackMessage(`${newFilesArray.length} 张图片已选择。`);
    } else {
      console.log('[handleImageSelect] No files selected or FileList is null.');
    }
  };

  const handleGenericFileSelect = (files: FileList | null) => {
    console.log('[handleGenericFileSelect] Called. Received FileList:', files);
    if (files && files.length > 0) {
      const newFilesArray = Array.from(files);
      console.log('[handleGenericFileSelect] New files array:', newFilesArray.map(f => f.name));
      setSelectedGenericFiles(prevFiles => {
        console.log('[handleGenericFileSelect] setSelectedGenericFiles updater - Previous selectedGenericFiles:', prevFiles.map(f => f.name));
        const updatedFiles = [...prevFiles, ...newFilesArray];
        console.log('[handleGenericFileSelect] setSelectedGenericFiles updater - Updated selectedGenericFiles:', updatedFiles.map(f => f.name));
        return updatedFiles;
      });
      setFeedbackMessage(`${newFilesArray.length} 个文件已选择。`);
    } else {
      console.log('[handleGenericFileSelect] No files selected or FileList is null.');
    }
  };

  const handleClearImage = useCallback((indexToRemove: number) => {
    console.log(`[handleClearImage] Clearing image at index: ${indexToRemove}`);
    setSelectedImages(prevImages => {
      const imageToRemove = prevImages[indexToRemove];
      console.log(`[handleClearImage] Image to remove: ${imageToRemove?.name}`);
      const updatedImages = prevImages.filter((_, index) => index !== indexToRemove);
      console.log('[handleClearImage] Updated selectedImages:', updatedImages.map(f => f.name));
      if (updatedImages.length === 0) {
        setFeedbackMessage(null);
      } else {
        setFeedbackMessage(`${updatedImages.length} 张图片剩余。`);
      }
      return updatedImages;
    });
  }, []); // useCallback is fine here as setSelectedImages has stable identity and no other state is used directly

  const handleClearAllImages = useCallback(() => {
    console.log('[handleClearAllImages] Clearing all images.');
    setSelectedImages([]);
    setFeedbackMessage(null);
  }, []);

  const handleClearGenericFile = useCallback((indexToRemove: number) => {
    console.log(`[handleClearGenericFile] Clearing file at index: ${indexToRemove}`);
    setSelectedGenericFiles(prevFiles => {
      const updatedFiles = prevFiles.filter((_, index) => index !== indexToRemove);
      console.log('[handleClearGenericFile] Updated selectedGenericFiles:', updatedFiles.map(f => f.name));
       if (updatedFiles.length === 0) {
        setFeedbackMessage(null);
      } else {
        setFeedbackMessage(`${updatedFiles.length} 个文件剩余。`);
      }
      return updatedFiles;
    });
  }, []);

  const handleClearAllGenericFiles = useCallback(() => {
    console.log('[handleClearAllGenericFiles] Clearing all generic files.');
    setSelectedGenericFiles([]);
    setFeedbackMessage(null);
  }, []);

  const handleProcessFiles = async () => {
    console.log('[handleProcessFiles] Processing files...');
    if (selectedImages.length === 0 && selectedGenericFiles.length === 0) {
      setFeedbackMessage('错误：请至少上传一张图片或一个文件。');
      return;
    }
    setIsProcessing(true);
    setFeedbackMessage('正在为您生成文案，请稍候...');
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setIsProcessing(false);
    // TODO: Replace with actual Gemini API call and response handling
    setFeedbackMessage('成功：文案已生成！(此为模拟结果)');
    console.log('[handleProcessFiles] Processing complete (simulated).');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 py-8 px-4 flex flex-col items-center selection:bg-indigo-500 selection:text-white">
      <header className="mb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
          电商文案<span className="text-indigo-400">写作助手</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
          上传您的商品图片和相关文件，AI 助您轻松生成吸引人的电商文案。
        </p>
      </header>

      <main className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <Card title="上传商品图片 (可多选)" className="bg-slate-800/70 border border-slate-700 shadow-indigo-500/20 backdrop-blur-sm">
          <FileUploadTrigger
            id="image-upload"
            onFileSelect={handleImageSelect}
            accept="image/*"
            label="点击选择图片"
            description="支持 PNG, JPG, GIF, WebP 等。推荐尺寸 800x800px 以上。"
            icon={<PhotographIcon className="w-10 h-10 text-indigo-400" />}
          />
          {selectedImages.length > 0 && (
            <div className="mt-6 space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              {selectedImages.map((file, index) => (
                <FileDisplay
                  key={`${file.name}-${file.lastModified}-${index}-${Math.random()}`} // Added Math.random for stronger key uniqueness if names/timestamps collide rapidly
                  file={file}
                  previewUrl={imagePreviewUrls[index] || null}
                  type="image"
                  onClear={() => handleClearImage(index)}
                />
              ))}
            </div>
          )}
          {selectedImages.length === 0 && !(feedbackMessage && feedbackMessage.includes("已选择")) && (
            <p className="mt-6 text-sm text-center text-slate-400 py-4">未选择任何图片。</p>
          )}
           {selectedImages.length > 0 && (
            <button
                onClick={handleClearAllImages}
                type="button"
                className="mt-4 w-full text-sm font-medium text-red-400 hover:text-red-300 transition-colors py-2.5 px-4 rounded-lg border border-red-500/50 hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                aria-label="清空所有已选图片"
            >
                清空所有图片
            </button>
          )}
        </Card>

        <Card title="上传参考文件 (可多选)" className="bg-slate-800/70 border border-slate-700 shadow-indigo-500/20 backdrop-blur-sm">
          <FileUploadTrigger
            id="file-upload"
            onFileSelect={handleGenericFileSelect}
            accept=".pdf,.doc,.docx,.txt,.md"
            label="点击选择文件"
            description="支持 PDF, DOC, TXT 等。单个文件建议不超过 5MB。"
            icon={<DocumentTextIcon className="w-10 h-10 text-indigo-400" />}
          />
          {selectedGenericFiles.length > 0 && (
            <div className="mt-6 space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              {selectedGenericFiles.map((file, index) => (
                <FileDisplay
                  key={`${file.name}-${file.lastModified}-${index}-${Math.random()}`} // Added Math.random for stronger key uniqueness
                  file={file}
                  type="generic"
                  onClear={() => handleClearGenericFile(index)}
                />
              ))}
            </div>
          )}
          {selectedGenericFiles.length === 0 && !(feedbackMessage && feedbackMessage.includes("已选择")) &&(
            <p className="mt-6 text-sm text-center text-slate-400 py-4">未选择任何参考文件。</p>
          )}
          {selectedGenericFiles.length > 0 && (
             <button
                onClick={handleClearAllGenericFiles}
                type="button"
                className="mt-4 w-full text-sm font-medium text-red-400 hover:text-red-300 transition-colors py-2.5 px-4 rounded-lg border border-red-500/50 hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                aria-label="清空所有已选文件"
            >
                清空所有文件
            </button>
          )}
        </Card>
      </main>

      {(selectedImages.length > 0 || selectedGenericFiles.length > 0) && !isProcessing && (
        <div className="mt-8 md:mt-10 w-full max-w-4xl">
          <button
            onClick={handleProcessFiles}
            disabled={isProcessing}
            type="button"
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 active:scale-100 transition-all duration-200 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
          >
            {isProcessing ? '正在生成...' : '开始生成文案'}
          </button>
        </div>
      )}

      {feedbackMessage && (
        <div className={`mt-6 text-center px-4 py-2.5 rounded-md shadow-sm text-sm font-medium
          ${feedbackMessage.includes('成功') ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
            feedbackMessage.includes('错误') || feedbackMessage.includes('请至少') ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
            feedbackMessage.includes('已选择') || feedbackMessage.includes('剩余') ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' :
            'bg-slate-700/80 text-slate-300 border border-slate-600/50'}`}
            role="alert"
        >
          {feedbackMessage}
        </div>
      )}

        <footer className="mt-12 mb-6 text-center text-slate-400 text-xs sm:text-sm">
            <p>&copy; {new Date().getFullYear()} 电商文案写作助手. 版权所有.</p>
            <p className="mt-1">由 React &amp; Gemini 驱动</p>
        </footer>
    </div>
  );
};

export default App;
