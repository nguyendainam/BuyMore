import * as React from "react";
import {
    Editor, EditorChangeEvent, EditorTools
} from '@progress/kendo-react-editor'
import styles from "./TextEditor.module.scss";
import '@progress/kendo-theme-default/dist/all.css';

const {
    Bold,
    Italic,
    Underline,
    FontName,
    AlignCenter,
    AlignRight,
    AlignLeft,
    AlignJustify,
    Undo,
    Redo,
    FontSize,
    InsertTable,
    InsertImage
} = EditorTools;

interface TextEditorProps {
    editorKey?: string,
    handleSendContext: (data: string, key?: string) => void;
    content?: string
}

// TextEditorProps
// { content, handleSendContext }
export const TextEditor: React.FC<TextEditorProps> = ({ handleSendContext, editorKey, content }) => {
    const handleOnchange = (event: EditorChangeEvent) => {
        handleSendContext(event.html, editorKey)
    }
    React.useEffect(() => { }, [content])


    try {
        return (
            <Editor
                tools={[
                    FontName,
                    FontSize,
                    [Bold, Italic, Underline],
                    [AlignCenter, AlignRight, AlignLeft, AlignJustify],
                    [Undo, Redo],
                    InsertTable,
                    InsertImage
                ]}
                className={styles.mainTextEditor}
                value={content ? content : ''}
                onChange={handleOnchange}

            />
        );
    } catch (error) {
        console.error('Error rendering Editor component:', error);
        return <div>Error rendering editor</div>;
    }
};
