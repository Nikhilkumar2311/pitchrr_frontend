/**
 * EditorPropertiesPanel — Right Properties Panel
 *
 * Shows contextual controls based on what's selected:
 * - No selection: Slide background controls
 * - Text selected: Font, size, color, alignment, decoration
 * - Image selected: Object fit, border, corner radius, replace image
 * - Shape selected: Fill, stroke, corner radius
 * - Common: Position, size, rotation, opacity, layer order, lock, delete
 */

import { useRef } from 'react';
import {
  Lock,
  Unlock,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ChevronsDown,
  Eye,
  EyeOff,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ImagePlus,
} from 'lucide-react';
import { useDeckEditorStore } from '@/store/useDeckEditorStore';
import {
  FONT_FAMILIES,
  PRESET_BACKGROUNDS,
  FONT_SIZE_PRESETS,
} from '@/types/deck-editor.types';
import type {
  TextElement,
  ImageElement,
  ShapeElement,
  SlideElement,
} from '@/types/deck-editor.types';

export default function EditorPropertiesPanel() {
  const {
    deck,
    activeSlideIndex,
    getSelectedElement,
    updateElement,
    deleteElement,
    duplicateElement,
    setSlideBackground,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
  } = useDeckEditorStore();

  const selectedElement = getSelectedElement();
  const slide = deck.slides[activeSlideIndex];

  // If no element selected, show slide controls
  if (!selectedElement) {
    return (
      <div className="flex flex-col h-full bg-gray-50 border-l border-gray-200 overflow-y-auto">
        <PanelHeader title="Slide" subtitle="Background & settings" />

        <div className="p-3 space-y-4">
          {/* Background Color */}
          <PropertySection title="Background">
            <div className="grid grid-cols-6 gap-1.5">
              {PRESET_BACKGROUNDS.map((bg) => {
                const isGradient = bg.includes('gradient');
                return (
                  <button
                    key={bg}
                    onClick={() => setSlideBackground(bg)}
                    className={`
                      w-full aspect-square rounded-md transition-all border
                      ${slide?.background === bg
                        ? 'ring-2 ring-blue-500 ring-offset-1 border-blue-400'
                        : 'border-gray-200 hover:border-gray-400 hover:scale-105'
                      }
                    `}
                    style={{
                      background: isGradient ? bg : undefined,
                      backgroundColor: !isGradient ? bg : undefined,
                    }}
                    title={bg}
                  />
                );
              })}
            </div>

            {/* Custom color */}
            <div className="flex items-center gap-2 mt-2">
              <input
                type="color"
                value={slide?.background?.startsWith('#') ? slide.background : '#FFFFFF'}
                onChange={(e) => setSlideBackground(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border border-gray-200"
              />
              <input
                type="text"
                value={slide?.background || '#FFFFFF'}
                onChange={(e) => setSlideBackground(e.target.value)}
                className="flex-1 px-2 py-1 text-xs font-mono border border-gray-200 rounded bg-white focus:ring-1 focus:ring-blue-300 outline-none"
                placeholder="#FFFFFF"
              />
            </div>
          </PropertySection>

          {/* Slide Info */}
          <PropertySection title="Info">
            <div className="text-xs text-gray-500 space-y-1">
              <div>Slide {activeSlideIndex + 1} of {deck.slides.length}</div>
              <div>{slide?.elements.length || 0} elements</div>
              <div>Canvas: {deck.canvasWidth} × {deck.canvasHeight}</div>
            </div>
          </PropertySection>
        </div>
      </div>
    );
  }

  // Element is selected — show properties
  const updateProp = (updates: Partial<SlideElement>) => {
    updateElement(selectedElement.id, updates);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 border-l border-gray-200 overflow-y-auto">
      <PanelHeader
        title={getElementTitle(selectedElement)}
        subtitle={selectedElement.type}
        badge={selectedElement.locked ? '🔒' : undefined}
      />

      <div className="p-3 space-y-4 pb-20">
        {/* ============================================================== */}
        {/* TEXT-SPECIFIC CONTROLS */}
        {/* ============================================================== */}
        {selectedElement.type === 'text' && (
          <>
            <PropertySection title="Typography">
              {/* Font Family */}
              <select
                value={(selectedElement as TextElement).fontFamily}
                onChange={(e) => updateProp({ fontFamily: e.target.value } as Partial<TextElement>)}
                className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-md bg-white focus:ring-1 focus:ring-blue-300 outline-none"
              >
                {FONT_FAMILIES.map((font) => (
                  <option key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </option>
                ))}
              </select>

              {/* Font Size */}
              <div className="flex items-center gap-2 mt-2">
                <select
                  value={(selectedElement as TextElement).fontSize}
                  onChange={(e) =>
                    updateProp({
                      fontSize: parseInt(e.target.value),
                    } as Partial<TextElement>)
                  }
                  className="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded-md bg-white focus:ring-1 focus:ring-blue-300 outline-none"
                >
                  {FONT_SIZE_PRESETS.map(({ label, value }) => (
                    <option key={value} value={value}>
                      {value}px — {label}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={(selectedElement as TextElement).fontSize}
                  onChange={(e) =>
                    updateProp({
                      fontSize: Math.max(8, parseInt(e.target.value) || 16),
                    } as Partial<TextElement>)
                  }
                  className="w-16 px-2 py-1.5 text-xs border border-gray-200 rounded-md bg-white focus:ring-1 focus:ring-blue-300 outline-none"
                  min={8}
                  max={200}
                />
              </div>

              {/* Style Toggles */}
              <div className="flex items-center gap-1 mt-2">
                <ToggleButton
                  icon={<Bold className="w-3.5 h-3.5" />}
                  active={(selectedElement as TextElement).fontWeight === 'bold'}
                  onClick={() =>
                    updateProp({
                      fontWeight:
                        (selectedElement as TextElement).fontWeight === 'bold'
                          ? 'normal'
                          : 'bold',
                    } as Partial<TextElement>)
                  }
                  title="Bold"
                />
                <ToggleButton
                  icon={<Italic className="w-3.5 h-3.5" />}
                  active={(selectedElement as TextElement).fontStyle === 'italic'}
                  onClick={() =>
                    updateProp({
                      fontStyle:
                        (selectedElement as TextElement).fontStyle === 'italic'
                          ? 'normal'
                          : 'italic',
                    } as Partial<TextElement>)
                  }
                  title="Italic"
                />
                <ToggleButton
                  icon={<Underline className="w-3.5 h-3.5" />}
                  active={(selectedElement as TextElement).textDecoration === 'underline'}
                  onClick={() =>
                    updateProp({
                      textDecoration:
                        (selectedElement as TextElement).textDecoration === 'underline'
                          ? 'none'
                          : 'underline',
                    } as Partial<TextElement>)
                  }
                  title="Underline"
                />
                <ToggleButton
                  icon={<Strikethrough className="w-3.5 h-3.5" />}
                  active={(selectedElement as TextElement).textDecoration === 'line-through'}
                  onClick={() =>
                    updateProp({
                      textDecoration:
                        (selectedElement as TextElement).textDecoration === 'line-through'
                          ? 'none'
                          : 'line-through',
                    } as Partial<TextElement>)
                  }
                  title="Strikethrough"
                />

                <div className="w-px h-5 bg-gray-200 mx-1" />

                {/* Alignment */}
                <ToggleButton
                  icon={<AlignLeft className="w-3.5 h-3.5" />}
                  active={(selectedElement as TextElement).textAlign === 'left'}
                  onClick={() =>
                    updateProp({ textAlign: 'left' } as Partial<TextElement>)
                  }
                  title="Align Left"
                />
                <ToggleButton
                  icon={<AlignCenter className="w-3.5 h-3.5" />}
                  active={(selectedElement as TextElement).textAlign === 'center'}
                  onClick={() =>
                    updateProp({ textAlign: 'center' } as Partial<TextElement>)
                  }
                  title="Align Center"
                />
                <ToggleButton
                  icon={<AlignRight className="w-3.5 h-3.5" />}
                  active={(selectedElement as TextElement).textAlign === 'right'}
                  onClick={() =>
                    updateProp({ textAlign: 'right' } as Partial<TextElement>)
                  }
                  title="Align Right"
                />
              </div>

              {/* Text Color */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-500 w-12">Color</span>
                <input
                  type="color"
                  value={(selectedElement as TextElement).fill}
                  onChange={(e) =>
                    updateProp({ fill: e.target.value } as Partial<TextElement>)
                  }
                  className="w-7 h-7 rounded cursor-pointer border border-gray-200"
                />
                <input
                  type="text"
                  value={(selectedElement as TextElement).fill}
                  onChange={(e) =>
                    updateProp({ fill: e.target.value } as Partial<TextElement>)
                  }
                  className="flex-1 px-2 py-1 text-xs font-mono border border-gray-200 rounded bg-white focus:ring-1 focus:ring-blue-300 outline-none"
                />
              </div>

              {/* Line Height */}
              <NumberInput
                label="Line Height"
                value={(selectedElement as TextElement).lineHeight}
                onChange={(v) =>
                  updateProp({ lineHeight: v } as Partial<TextElement>)
                }
                min={0.8}
                max={3}
                step={0.1}
              />

              {/* Letter Spacing */}
              <NumberInput
                label="Spacing"
                value={(selectedElement as TextElement).letterSpacing}
                onChange={(v) =>
                  updateProp({ letterSpacing: v } as Partial<TextElement>)
                }
                min={-5}
                max={20}
                step={0.5}
                unit="px"
              />
            </PropertySection>
          </>
        )}

        {/* ============================================================== */}
        {/* IMAGE-SPECIFIC CONTROLS */}
        {/* ============================================================== */}
        {selectedElement.type === 'image' && (
          <PropertySection title="Image">
            {/* Replace Image */}
            <ReplaceImageButton elementId={selectedElement.id} />

            {/* Corner Radius */}
            <NumberInput
              label="Radius"
              value={(selectedElement as ImageElement).cornerRadius}
              onChange={(v) =>
                updateProp({ cornerRadius: v } as Partial<ImageElement>)
              }
              min={0}
              max={100}
              step={1}
              unit="px"
            />

            {/* Border */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-12">Border</span>
              <input
                type="color"
                value={(selectedElement as ImageElement).borderColor}
                onChange={(e) =>
                  updateProp({
                    borderColor: e.target.value,
                  } as Partial<ImageElement>)
                }
                className="w-7 h-7 rounded cursor-pointer border border-gray-200"
              />
              <input
                type="number"
                value={(selectedElement as ImageElement).borderWidth}
                onChange={(e) =>
                  updateProp({
                    borderWidth: Math.max(0, parseInt(e.target.value) || 0),
                  } as Partial<ImageElement>)
                }
                className="w-16 px-2 py-1 text-xs border border-gray-200 rounded bg-white focus:ring-1 focus:ring-blue-300 outline-none"
                min={0}
                max={20}
              />
            </div>
          </PropertySection>
        )}

        {/* ============================================================== */}
        {/* SHAPE-SPECIFIC CONTROLS */}
        {/* ============================================================== */}
        {selectedElement.type === 'shape' && (
          <PropertySection title="Shape">
            {/* Shape type display */}
            <div className="text-xs text-gray-500 capitalize mb-2">
              {(selectedElement as ShapeElement).shapeType}
            </div>

            {/* Fill Color */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-12">Fill</span>
              <input
                type="color"
                value={(selectedElement as ShapeElement).fill}
                onChange={(e) =>
                  updateProp({ fill: e.target.value } as Partial<ShapeElement>)
                }
                className="w-7 h-7 rounded cursor-pointer border border-gray-200"
              />
              <input
                type="text"
                value={(selectedElement as ShapeElement).fill}
                onChange={(e) =>
                  updateProp({ fill: e.target.value } as Partial<ShapeElement>)
                }
                className="flex-1 px-2 py-1 text-xs font-mono border border-gray-200 rounded bg-white focus:ring-1 focus:ring-blue-300 outline-none"
              />
            </div>

            {/* Stroke Color & Width */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-gray-500 w-12">Stroke</span>
              <input
                type="color"
                value={(selectedElement as ShapeElement).stroke || '#000000'}
                onChange={(e) =>
                  updateProp({ stroke: e.target.value } as Partial<ShapeElement>)
                }
                className="w-7 h-7 rounded cursor-pointer border border-gray-200"
              />
              <input
                type="number"
                value={(selectedElement as ShapeElement).strokeWidth}
                onChange={(e) =>
                  updateProp({
                    strokeWidth: Math.max(0, parseInt(e.target.value) || 0),
                  } as Partial<ShapeElement>)
                }
                className="w-16 px-2 py-1 text-xs border border-gray-200 rounded bg-white focus:ring-1 focus:ring-blue-300 outline-none"
                min={0}
                max={20}
              />
            </div>

            {/* Corner Radius (rectangle only) */}
            {(selectedElement as ShapeElement).shapeType === 'rectangle' && (
              <NumberInput
                label="Radius"
                value={(selectedElement as ShapeElement).cornerRadius}
                onChange={(v) =>
                  updateProp({ cornerRadius: v } as Partial<ShapeElement>)
                }
                min={0}
                max={100}
                step={1}
                unit="px"
              />
            )}
          </PropertySection>
        )}

        {/* ============================================================== */}
        {/* COMMON CONTROLS (ALL ELEMENTS) */}
        {/* ============================================================== */}
        <PropertySection title="Transform">
          <div className="grid grid-cols-2 gap-2">
            <NumberInput
              label="X"
              value={Math.round(selectedElement.x)}
              onChange={(v) => updateProp({ x: v })}
              step={1}
            />
            <NumberInput
              label="Y"
              value={Math.round(selectedElement.y)}
              onChange={(v) => updateProp({ y: v })}
              step={1}
            />
            <NumberInput
              label="W"
              value={Math.round(selectedElement.width)}
              onChange={(v) => updateProp({ width: Math.max(10, v) })}
              min={10}
              step={1}
            />
            <NumberInput
              label="H"
              value={Math.round(selectedElement.height)}
              onChange={(v) => updateProp({ height: Math.max(5, v) })}
              min={5}
              step={1}
            />
          </div>

          <NumberInput
            label="Rotate"
            value={Math.round(selectedElement.rotation)}
            onChange={(v) => updateProp({ rotation: v })}
            min={-360}
            max={360}
            step={1}
            unit="°"
          />

          {/* Opacity */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-500 w-12">Opacity</span>
            <input
              type="range"
              value={selectedElement.opacity * 100}
              onChange={(e) =>
                updateProp({ opacity: parseInt(e.target.value) / 100 })
              }
              min={0}
              max={100}
              className="flex-1 h-1.5 bg-gray-200 rounded-full accent-blue-500"
            />
            <span className="text-xs text-gray-500 w-10 text-right">
              {Math.round(selectedElement.opacity * 100)}%
            </span>
          </div>
        </PropertySection>

        {/* Layer Controls */}
        <PropertySection title="Layer">
          <div className="flex items-center gap-1">
            <LayerButton
              icon={<ChevronsUp className="w-3.5 h-3.5" />}
              title="Bring to Front"
              onClick={() => bringToFront(selectedElement.id)}
            />
            <LayerButton
              icon={<ArrowUp className="w-3.5 h-3.5" />}
              title="Bring Forward"
              onClick={() => bringForward(selectedElement.id)}
            />
            <LayerButton
              icon={<ArrowDown className="w-3.5 h-3.5" />}
              title="Send Backward"
              onClick={() => sendBackward(selectedElement.id)}
            />
            <LayerButton
              icon={<ChevronsDown className="w-3.5 h-3.5" />}
              title="Send to Back"
              onClick={() => sendToBack(selectedElement.id)}
            />

            <div className="flex-1" />

            {/* Lock */}
            <button
              onClick={() =>
                updateProp({ locked: !selectedElement.locked })
              }
              className={`
                p-1.5 rounded-md transition-colors text-xs
                ${selectedElement.locked
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }
              `}
              title={selectedElement.locked ? 'Unlock' : 'Lock'}
            >
              {selectedElement.locked ? (
                <Lock className="w-3.5 h-3.5" />
              ) : (
                <Unlock className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Visibility */}
            <button
              onClick={() =>
                updateProp({ visible: !selectedElement.visible })
              }
              className={`
                p-1.5 rounded-md transition-colors text-xs
                ${!selectedElement.visible
                  ? 'bg-gray-200 text-gray-400'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }
              `}
              title={selectedElement.visible ? 'Hide' : 'Show'}
            >
              {selectedElement.visible ? (
                <Eye className="w-3.5 h-3.5" />
              ) : (
                <EyeOff className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </PropertySection>

        {/* Actions */}
        <PropertySection title="Actions">
          <div className="flex items-center gap-2">
            <button
              onClick={() => duplicateElement(selectedElement.id)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              Duplicate
            </button>
            <button
              onClick={() => deleteElement(selectedElement.id)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </PropertySection>
      </div>
    </div>
  );
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

function PanelHeader({
  title,
  subtitle,
  badge,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
}) {
  return (
    <div className="px-3 py-2.5 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-2">
        <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
          {title}
        </h3>
        {badge && <span className="text-xs">{badge}</span>}
      </div>
      {subtitle && (
        <span className="text-[10px] text-gray-400 capitalize">{subtitle}</span>
      )}
    </div>
  );
}

function PropertySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
        {title}
      </h4>
      {children}
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 w-12">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          let v = parseFloat(e.target.value) || 0;
          if (min !== undefined) v = Math.max(min, v);
          if (max !== undefined) v = Math.min(max, v);
          onChange(v);
        }}
        min={min}
        max={max}
        step={step}
        className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded bg-white focus:ring-1 focus:ring-blue-300 outline-none"
      />
      {unit && (
        <span className="text-[10px] text-gray-400 w-6">{unit}</span>
      )}
    </div>
  );
}

function ToggleButton({
  icon,
  active,
  onClick,
  title,
}: {
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`
        p-1.5 rounded-md transition-all
        ${active
          ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-200'
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
        }
      `}
    >
      {icon}
    </button>
  );
}

function LayerButton({
  icon,
  title,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="p-1.5 rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
    >
      {icon}
    </button>
  );
}

function ReplaceImageButton({ elementId }: { elementId: string }) {
  const { updateElement } = useDeckEditorStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleReplace = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateElement(elementId, { src: reader.result } as Partial<ImageElement>);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <>
      <button
        onClick={() => fileRef.current?.click()}
        className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors mb-2"
      >
        <ImagePlus className="w-3.5 h-3.5" />
        Replace Image
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleReplace}
        className="hidden"
      />
    </>
  );
}

function getElementTitle(element: SlideElement): string {
  switch (element.type) {
    case 'text':
      return (element as TextElement).content.substring(0, 20) || 'Text';
    case 'image':
      return 'Image';
    case 'shape':
      return (element as ShapeElement).shapeType;
    default:
      return 'Element';
  }
}
