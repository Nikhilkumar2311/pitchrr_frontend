/**
 * EditorSlidesPanel — Left Slide Thumbnails Panel
 *
 * Features:
 * - Slide thumbnails with colored background preview
 * - Active slide highlighted with blue ring
 * - Element count badge on each slide
 * - Add / Duplicate / Delete slide actions
 * - Slide context menu (right-click actions)
 */

import { useState } from 'react';
import { Plus, Copy, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { useDeckEditorStore } from '@/store/useDeckEditorStore';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/types/deck-editor.types';

export default function EditorSlidesPanel() {
  const {
    deck,
    activeSlideIndex,
    setActiveSlide,
    addSlide,
    duplicateSlide,
    deleteSlide,
    reorderSlides,
  } = useDeckEditorStore();

  const [contextMenu, setContextMenu] = useState<{
    slideIndex: number;
    x: number;
    y: number;
  } | null>(null);

  const handleContextMenu = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    setContextMenu({ slideIndex: index, x: e.clientX, y: e.clientY });
  };

  const closeContextMenu = () => setContextMenu(null);

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      reorderSlides(index, index - 1);
    }
    closeContextMenu();
  };

  const handleMoveDown = (index: number) => {
    if (index < deck.slides.length - 1) {
      reorderSlides(index, index + 1);
    }
    closeContextMenu();
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 border-r border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-200">
        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Slides
        </span>
        <button
          onClick={() => addSlide()}
          className="p-1 rounded-md text-gray-500 hover:bg-blue-100 hover:text-blue-600 transition-colors"
          title="Add Slide"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Slide List */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-2">
        {deck.slides.map((slide, index) => {
          const isActive = index === activeSlideIndex;
          const isGradient = slide.background.includes('gradient');

          return (
            <button
              key={slide.id}
              onClick={() => setActiveSlide(index)}
              onContextMenu={(e) => handleContextMenu(e, index)}
              className={`
                group relative w-full rounded-lg overflow-hidden transition-all text-left
                ${isActive
                  ? 'ring-2 ring-blue-500 ring-offset-2 shadow-md'
                  : 'ring-1 ring-gray-200 hover:ring-gray-300 hover:shadow-sm'
                }
              `}
            >
              {/* Mini slide preview */}
              <div
                className="relative w-full"
                style={{
                  aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}`,
                  background: isGradient ? slide.background : undefined,
                  backgroundColor: !isGradient ? slide.background : undefined,
                }}
              >
                {/* Element dots preview */}
                <div className="absolute inset-0 p-2">
                  {/* Show dots representing elements */}
                  {slide.elements.slice(0, 8).map((el) => (
                    <div
                      key={el.id}
                      className="absolute rounded-sm"
                      style={{
                        left: `${(el.x / CANVAS_WIDTH) * 100}%`,
                        top: `${(el.y / CANVAS_HEIGHT) * 100}%`,
                        width: `${Math.max(8, (el.width / CANVAS_WIDTH) * 100)}%`,
                        height: `${Math.max(4, (el.height / CANVAS_HEIGHT) * 100)}%`,
                        backgroundColor:
                          el.type === 'text'
                            ? 'rgba(59,130,246,0.3)'
                            : el.type === 'shape'
                              ? 'rgba(168,85,247,0.3)'
                              : 'rgba(234,179,8,0.3)',
                        border: '1px solid rgba(0,0,0,0.08)',
                      }}
                    />
                  ))}
                </div>

                {/* Slide number */}
                <div className="absolute bottom-1 right-1.5 bg-black/30 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                  {index + 1}
                </div>

                {/* Element count */}
                {slide.elements.length > 0 && (
                  <div className="absolute top-1 right-1.5 bg-white/80 text-gray-600 text-[8px] font-medium px-1 py-0.5 rounded backdrop-blur-sm">
                    {slide.elements.length} {slide.elements.length === 1 ? 'el' : 'els'}
                  </div>
                )}
              </div>

              {/* Hover actions */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-end justify-center opacity-0 group-hover:opacity-100 pb-2 gap-1">
                <ActionBtn
                  icon={<Copy className="w-3 h-3" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateSlide(index);
                  }}
                  title="Duplicate"
                />
                {deck.slides.length > 1 && (
                  <ActionBtn
                    icon={<Trash2 className="w-3 h-3" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSlide(index);
                    }}
                    title="Delete"
                    variant="danger"
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Add Slide Button at bottom */}
      <div className="px-2 py-2 border-t border-gray-200">
        <button
          onClick={() => addSlide()}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-gray-500 bg-white border border-dashed border-gray-300 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Slide
        </button>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div className="fixed inset-0 z-50" onClick={closeContextMenu} />
          <div
            className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[140px]"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <ContextMenuItem
              icon={<Copy className="w-3.5 h-3.5" />}
              label="Duplicate"
              onClick={() => {
                duplicateSlide(contextMenu.slideIndex);
                closeContextMenu();
              }}
            />
            <ContextMenuItem
              icon={<ChevronUp className="w-3.5 h-3.5" />}
              label="Move Up"
              onClick={() => handleMoveUp(contextMenu.slideIndex)}
              disabled={contextMenu.slideIndex === 0}
            />
            <ContextMenuItem
              icon={<ChevronDown className="w-3.5 h-3.5" />}
              label="Move Down"
              onClick={() => handleMoveDown(contextMenu.slideIndex)}
              disabled={contextMenu.slideIndex === deck.slides.length - 1}
            />
            {deck.slides.length > 1 && (
              <>
                <div className="h-px bg-gray-100 my-1" />
                <ContextMenuItem
                  icon={<Trash2 className="w-3.5 h-3.5" />}
                  label="Delete"
                  onClick={() => {
                    deleteSlide(contextMenu.slideIndex);
                    closeContextMenu();
                  }}
                  variant="danger"
                />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

function ActionBtn({
  icon,
  onClick,
  title,
  variant = 'default',
}: {
  icon: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  title: string;
  variant?: 'default' | 'danger';
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`
        p-1 rounded-md backdrop-blur-sm transition-all
        ${variant === 'danger'
          ? 'bg-red-500/80 text-white hover:bg-red-600/90'
          : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-sm'
        }
      `}
    >
      {icon}
    </button>
  );
}

function ContextMenuItem({
  icon,
  label,
  onClick,
  disabled,
  variant = 'default',
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'danger';
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium transition-colors
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variant === 'danger'
          ? 'text-red-600 hover:bg-red-50'
          : 'text-gray-700 hover:bg-gray-50'
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}
