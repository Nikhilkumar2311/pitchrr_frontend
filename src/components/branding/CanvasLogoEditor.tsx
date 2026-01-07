/**
 * Canvas-based Logo Editor
 * 
 * Advanced logo editor using Konva for full canvas manipulation.
 * Features: drag-drop, layers, rotation, scaling, and export.
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { Stage, Layer, Rect, Text, Circle, Image as KonvaImage, Transformer } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import type Konva from 'konva';
import {
    Download,
    Type,
    Square,
    Circle as CircleIcon,
    Trash2,
    Undo2,
    Redo2,
    Layers,
    Image as ImageIcon,
} from 'lucide-react';
import { Button, Input } from '@/components/ui';
import toast from 'react-hot-toast';

// Element types
type ElementType = 'text' | 'rect' | 'circle' | 'image';

interface CanvasElement {
    id: string;
    type: ElementType;
    x: number;
    y: number;
    width?: number;
    height?: number;
    radius?: number;
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    fill: string;
    rotation?: number;
    scaleX?: number;
    scaleY?: number;
    image?: HTMLImageElement;
}

interface CanvasLogoEditorProps {
    startupName: string;
    primaryColor: string;
    secondaryColor?: string;
}

// Font options
const fonts = [
    'Inter', 'Poppins', 'Montserrat', 'Roboto', 'Arial Black', 'Georgia'
];

// Color presets
const colorPresets = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#EC4899', '#06B6D4', '#1F2937', '#FFFFFF', '#000000'
];

export function CanvasLogoEditor({
    startupName,
    primaryColor,
}: CanvasLogoEditorProps) {
    const [canvasSize] = useState({ width: 400, height: 400 });
    const [backgroundColor, setBackgroundColor] = useState(primaryColor);
    const [elements, setElements] = useState<CanvasElement[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [history, setHistory] = useState<CanvasElement[][]>([[]]);
    const [historyIndex, setHistoryIndex] = useState(0);

    const stageRef = useRef<Konva.Stage>(null);
    const transformerRef = useRef<Konva.Transformer>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize with startup name
    useEffect(() => {
        if (startupName && elements.length === 0) {
            addTextElement(startupName);
        }
    }, [startupName]);

    // Update transformer when selection changes
    useEffect(() => {
        if (transformerRef.current && stageRef.current) {
            const selectedNode = stageRef.current.findOne(`#${selectedId}`);
            if (selectedNode) {
                transformerRef.current.nodes([selectedNode]);
                transformerRef.current.getLayer()?.batchDraw();
            } else {
                transformerRef.current.nodes([]);
            }
        }
    }, [selectedId]);

    // Generate unique ID
    const generateId = () => `elem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Save to history
    const saveHistory = (newElements: CanvasElement[]) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newElements);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    // Add text element
    const addTextElement = (text?: string) => {
        const newElement: CanvasElement = {
            id: generateId(),
            type: 'text',
            x: canvasSize.width / 2 - 50,
            y: canvasSize.height / 2 - 20,
            text: text || 'Text',
            fontSize: 32,
            fontFamily: 'Inter',
            fill: '#FFFFFF',
        };
        const newElements = [...elements, newElement];
        setElements(newElements);
        saveHistory(newElements);
        setSelectedId(newElement.id);
    };

    // Add shape element
    const addShapeElement = (type: 'rect' | 'circle') => {
        const newElement: CanvasElement = {
            id: generateId(),
            type,
            x: canvasSize.width / 2 - 40,
            y: canvasSize.height / 2 - 40,
            width: type === 'rect' ? 80 : undefined,
            height: type === 'rect' ? 80 : undefined,
            radius: type === 'circle' ? 40 : undefined,
            fill: '#FFFFFF',
        };
        const newElements = [...elements, newElement];
        setElements(newElements);
        saveHistory(newElements);
        setSelectedId(newElement.id);
    };

    // Handle image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const img = new window.Image();
                img.onload = () => {
                    const scale = Math.min(100 / img.width, 100 / img.height);
                    const newElement: CanvasElement = {
                        id: generateId(),
                        type: 'image',
                        x: canvasSize.width / 2 - (img.width * scale) / 2,
                        y: canvasSize.height / 2 - (img.height * scale) / 2,
                        width: img.width * scale,
                        height: img.height * scale,
                        fill: 'transparent',
                        image: img,
                    };
                    const newElements = [...elements, newElement];
                    setElements(newElements);
                    saveHistory(newElements);
                    setSelectedId(newElement.id);
                };
                img.src = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    // Update element
    const updateElement = (id: string, updates: Partial<CanvasElement>) => {
        const newElements = elements.map(el =>
            el.id === id ? { ...el, ...updates } : el
        );
        setElements(newElements);
        saveHistory(newElements);
    };

    // Delete selected element
    const deleteSelected = () => {
        if (selectedId) {
            const newElements = elements.filter(el => el.id !== selectedId);
            setElements(newElements);
            saveHistory(newElements);
            setSelectedId(null);
        }
    };

    // Undo/Redo
    const undo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setElements(history[historyIndex - 1]);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setElements(history[historyIndex + 1]);
        }
    };

    // Handle drag end
    const handleDragEnd = (e: KonvaEventObject<DragEvent>, id: string) => {
        updateElement(id, { x: e.target.x(), y: e.target.y() });
    };

    // Handle transform end
    const handleTransformEnd = (e: KonvaEventObject<Event>, id: string) => {
        const node = e.target;
        updateElement(id, {
            x: node.x(),
            y: node.y(),
            width: node.width() * node.scaleX(),
            height: node.height() * node.scaleY(),
            rotation: node.rotation(),
            scaleX: 1,
            scaleY: 1,
        });
        node.scaleX(1);
        node.scaleY(1);
    };

    // Export logo
    const downloadLogo = useCallback((size: number = 512) => {
        if (stageRef.current) {
            // Deselect before export
            setSelectedId(null);

            setTimeout(() => {
                const uri = stageRef.current?.toDataURL({
                    pixelRatio: size / canvasSize.width,
                });
                if (uri) {
                    const link = document.createElement('a');
                    link.download = `logo-${size}x${size}.png`;
                    link.href = uri;
                    link.click();
                    toast.success(`Logo downloaded (${size}x${size}px)`);
                }
            }, 100);
        }
    }, [canvasSize.width]);

    // Get selected element
    const selectedElement = elements.find(el => el.id === selectedId);

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
                <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Type className="w-4 h-4" />}
                    onClick={() => addTextElement()}
                >
                    Text
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Square className="w-4 h-4" />}
                    onClick={() => addShapeElement('rect')}
                >
                    Square
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<CircleIcon className="w-4 h-4" />}
                    onClick={() => addShapeElement('circle')}
                >
                    Circle
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<ImageIcon className="w-4 h-4" />}
                    onClick={() => fileInputRef.current?.click()}
                >
                    Image
                </Button>
                <div className="h-6 w-px bg-gray-300 mx-1" />
                <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Undo2 className="w-4 h-4" />}
                    onClick={undo}
                    disabled={historyIndex <= 0}
                >
                    Undo
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Redo2 className="w-4 h-4" />}
                    onClick={redo}
                    disabled={historyIndex >= history.length - 1}
                >
                    Redo
                </Button>
                {selectedId && (
                    <>
                        <div className="h-6 w-px bg-gray-300 mx-1" />
                        <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<Trash2 className="w-4 h-4" />}
                            onClick={deleteSelected}
                            className="text-red-600 hover:bg-red-50"
                        >
                            Delete
                        </Button>
                    </>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                />
            </div>

            {/* Canvas */}
            <div className="border rounded-lg overflow-hidden bg-gray-100 flex justify-center p-4">
                <Stage
                    ref={stageRef}
                    width={canvasSize.width}
                    height={canvasSize.height}
                    onClick={(e) => {
                        if (e.target === e.currentTarget || e.target.getClassName() === 'Rect') {
                            if (e.target.id() === 'background') {
                                setSelectedId(null);
                            }
                        }
                    }}
                    className="shadow-xl rounded-lg overflow-hidden"
                >
                    <Layer>
                        {/* Background */}
                        <Rect
                            id="background"
                            x={0}
                            y={0}
                            width={canvasSize.width}
                            height={canvasSize.height}
                            fill={backgroundColor}
                        />

                        {/* Elements */}
                        {elements.map((el) => {
                            if (el.type === 'text') {
                                return (
                                    <Text
                                        key={el.id}
                                        id={el.id}
                                        x={el.x}
                                        y={el.y}
                                        text={el.text}
                                        fontSize={el.fontSize}
                                        fontFamily={el.fontFamily}
                                        fill={el.fill}
                                        draggable
                                        onClick={() => setSelectedId(el.id)}
                                        onTap={() => setSelectedId(el.id)}
                                        onDragEnd={(e) => handleDragEnd(e, el.id)}
                                        onTransformEnd={(e) => handleTransformEnd(e, el.id)}
                                    />
                                );
                            }
                            if (el.type === 'rect') {
                                return (
                                    <Rect
                                        key={el.id}
                                        id={el.id}
                                        x={el.x}
                                        y={el.y}
                                        width={el.width}
                                        height={el.height}
                                        fill={el.fill}
                                        rotation={el.rotation}
                                        draggable
                                        onClick={() => setSelectedId(el.id)}
                                        onTap={() => setSelectedId(el.id)}
                                        onDragEnd={(e) => handleDragEnd(e, el.id)}
                                        onTransformEnd={(e) => handleTransformEnd(e, el.id)}
                                    />
                                );
                            }
                            if (el.type === 'circle') {
                                return (
                                    <Circle
                                        key={el.id}
                                        id={el.id}
                                        x={el.x}
                                        y={el.y}
                                        radius={el.radius}
                                        fill={el.fill}
                                        draggable
                                        onClick={() => setSelectedId(el.id)}
                                        onTap={() => setSelectedId(el.id)}
                                        onDragEnd={(e) => handleDragEnd(e, el.id)}
                                        onTransformEnd={(e) => handleTransformEnd(e, el.id)}
                                    />
                                );
                            }
                            if (el.type === 'image' && el.image) {
                                return (
                                    <KonvaImage
                                        key={el.id}
                                        id={el.id}
                                        x={el.x}
                                        y={el.y}
                                        width={el.width}
                                        height={el.height}
                                        image={el.image}
                                        draggable
                                        onClick={() => setSelectedId(el.id)}
                                        onTap={() => setSelectedId(el.id)}
                                        onDragEnd={(e) => handleDragEnd(e, el.id)}
                                        onTransformEnd={(e) => handleTransformEnd(e, el.id)}
                                    />
                                );
                            }
                            return null;
                        })}

                        {/* Transformer */}
                        <Transformer
                            ref={transformerRef}
                            boundBoxFunc={(oldBox, newBox) => {
                                if (newBox.width < 5 || newBox.height < 5) {
                                    return oldBox;
                                }
                                return newBox;
                            }}
                        />
                    </Layer>
                </Stage>
            </div>

            {/* Properties Panel */}
            {selectedElement && (
                <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                    <h3 className="font-medium text-gray-900 flex items-center gap-2">
                        <Layers className="w-4 h-4" />
                        Element Properties
                    </h3>

                    {/* Text properties */}
                    {selectedElement.type === 'text' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
                                <Input
                                    value={selectedElement.text || ''}
                                    onChange={(e) => updateElement(selectedId!, { text: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
                                <input
                                    type="range"
                                    min="12"
                                    max="72"
                                    value={selectedElement.fontSize || 32}
                                    onChange={(e) => updateElement(selectedId!, { fontSize: Number(e.target.value) })}
                                    className="w-full"
                                />
                                <span className="text-sm text-gray-500">{selectedElement.fontSize || 32}px</span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Font</label>
                                <div className="flex flex-wrap gap-1">
                                    {fonts.map((font) => (
                                        <button
                                            key={font}
                                            onClick={() => updateElement(selectedId!, { fontFamily: font })}
                                            className={`px-2 py-1 text-xs rounded border ${selectedElement.fontFamily === font
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200'
                                                }`}
                                            style={{ fontFamily: font }}
                                        >
                                            {font}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Color */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                        <div className="flex flex-wrap gap-1">
                            {colorPresets.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => updateElement(selectedId!, { fill: color })}
                                    className={`w-6 h-6 rounded border-2 ${selectedElement.fill === color ? 'border-blue-500' : 'border-gray-200'
                                        }`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                            <input
                                type="color"
                                value={selectedElement.fill}
                                onChange={(e) => updateElement(selectedId!, { fill: e.target.value })}
                                className="w-6 h-6 rounded cursor-pointer"
                            />
                        </div>
                        <div className="mt-2 flex items-center gap-2 bg-white rounded-lg p-1.5 border w-fit">
                            <div
                                className="w-6 h-6 rounded border border-gray-300 flex-shrink-0"
                                style={{ backgroundColor: selectedElement.fill }}
                            />
                            <input
                                type="text"
                                value={selectedElement.fill.toUpperCase()}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val.match(/^#[0-9A-Fa-f]{0,6}$/)) {
                                        updateElement(selectedId!, { fill: val });
                                    }
                                }}
                                placeholder="#FFFFFF"
                                className="w-20 px-2 py-1 text-xs font-mono bg-gray-50 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(selectedElement.fill);
                                    toast.success('Copied!');
                                }}
                                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                                title="Copy"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Background Color */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                <div className="flex flex-wrap gap-1">
                    {colorPresets.map((color) => (
                        <button
                            key={color}
                            onClick={() => setBackgroundColor(color)}
                            className={`w-7 h-7 rounded border-2 ${backgroundColor === color ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                                }`}
                            style={{ backgroundColor: color }}
                        />
                    ))}
                    <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-7 h-7 rounded cursor-pointer"
                    />
                </div>
                <div className="mt-2 flex items-center gap-2 bg-gray-50 rounded-lg p-1.5 border w-fit">
                    <div
                        className="w-6 h-6 rounded border border-gray-300 flex-shrink-0"
                        style={{ backgroundColor }}
                    />
                    <input
                        type="text"
                        value={backgroundColor.toUpperCase()}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val.match(/^#[0-9A-Fa-f]{0,6}$/)) {
                                setBackgroundColor(val);
                            }
                        }}
                        placeholder="#3B82F6"
                        className="w-20 px-2 py-1 text-xs font-mono bg-white border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(backgroundColor);
                            toast.success('Copied!');
                        }}
                        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
                        title="Copy hex code"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Export Buttons */}
            <div className="flex gap-2">
                <Button
                    variant="secondary"
                    leftIcon={<Download className="w-4 h-4" />}
                    onClick={() => downloadLogo(256)}
                    className="flex-1"
                >
                    256px
                </Button>
                <Button
                    variant="primary"
                    leftIcon={<Download className="w-4 h-4" />}
                    onClick={() => downloadLogo(512)}
                    className="flex-1"
                >
                    512px
                </Button>
                <Button
                    variant="secondary"
                    leftIcon={<Download className="w-4 h-4" />}
                    onClick={() => downloadLogo(1024)}
                    className="flex-1"
                >
                    1024px
                </Button>
            </div>
        </div>
    );
}
