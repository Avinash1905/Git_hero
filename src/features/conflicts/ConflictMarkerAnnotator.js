/**
 * GitQuest Frontend - Conflict Marker Annotator
 * Highlights and annotates Git conflict markers:
 * `<<<<<<<`, `|||||||`, `=======`, and `>>>>>>>` with inline author chips and resolution guides.
 */

export class ConflictMarkerAnnotator {
  annotateConflictText(rawFileContent) {
    const lines = (rawFileContent || '').split('\n');
    const annotated = [];

    let inConflict = false;
    let section = 'NORMAL'; // 'HEAD', 'BASE', 'INCOMING'

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith('<<<<<<<')) {
        inConflict = true;
        section = 'HEAD';
        annotated.push({
          lineNum: i + 1,
          type: 'MARKER_HEAD',
          text: line,
          label: 'CURRENT CHANGE (HEAD)'
        });
      } else if (line.startsWith('|||||||')) {
        section = 'BASE';
        annotated.push({
          lineNum: i + 1,
          type: 'MARKER_BASE',
          text: line,
          label: 'BASE ANCESTOR'
        });
      } else if (line.startsWith('=======')) {
        section = 'INCOMING';
        annotated.push({
          lineNum: i + 1,
          type: 'MARKER_SEPARATOR',
          text: line,
          label: 'INCOMING CHANGE'
        });
      } else if (line.startsWith('>>>>>>>')) {
        inConflict = false;
        section = 'NORMAL';
        annotated.push({
          lineNum: i + 1,
          type: 'MARKER_END',
          text: line,
          label: 'END OF CONFLICT'
        });
      } else {
        annotated.push({
          lineNum: i + 1,
          type: inConflict ? `CONFLICT_${section}` : 'NORMAL',
          text: line
        });
      }
    }

    return {
      annotatedLines: annotated,
      hasConflicts: annotated.some(a => a.type.startsWith('MARKER'))
    };
  }

  renderAnnotatedHtml(rawFileContent) {
    const { annotatedLines } = this.annotateConflictText(rawFileContent);

    return `
      <div class="annotated-conflict-view" style="background:#0f172a; border-radius:8px; border:1px solid #334155; padding:12px; font-family:monospace; font-size:11px; max-height:280px; overflow-y:auto;">
        ${annotatedLines.map(a => {
          let bg = 'transparent';
          let color = '#cbd5e1';
          let border = 'none';

          if (a.type === 'MARKER_HEAD') {
            bg = 'rgba(56,189,248,0.2)';
            color = '#38bdf8';
            border = '1px solid #38bdf8';
          } else if (a.type === 'MARKER_SEPARATOR') {
            bg = 'rgba(245,158,11,0.2)';
            color = '#f59e0b';
            border = '1px solid #f59e0b';
          } else if (a.type === 'MARKER_END') {
            bg = 'rgba(52,211,153,0.2)';
            color = '#34d399';
            border = '1px solid #34d399';
          } else if (a.type === 'CONFLICT_HEAD') {
            bg = 'rgba(56,189,248,0.06)';
          } else if (a.type === 'CONFLICT_INCOMING') {
            bg = 'rgba(52,211,153,0.06)';
          }

          return `
            <div style="display:flex; gap:8px; background:${bg}; border-left:${border}; padding:2px 6px;">
              <span style="color:#64748b; width:24px; text-align:right; user-select:none;">${a.lineNum}</span>
              <span style="color:${color};">${a.text} ${a.label ? `[${a.label}]` : ''}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
}
