/**
 * GitQuest Game Engine - Git Autosquash Engine
 * Implements `git rebase -i --autosquash` logic:
 * automatically matches `fixup! <subject>` and `squash! <subject>` commits,
 * reorders them immediately after target commits, and rewrites the todo list.
 */

export class GitAutosquashEngine {
  processTodoList(todoList = []) {
    const normalItems = [];
    const fixupItems = [];
    const squashItems = [];

    for (const item of todoList) {
      if (item.subject.startsWith('fixup! ')) {
        const targetSubject = item.subject.substring('fixup! '.length).trim();
        fixupItems.push({ item, targetSubject, action: 'fixup' });
      } else if (item.subject.startsWith('squash! ')) {
        const targetSubject = item.subject.substring('squash! '.length).trim();
        squashItems.push({ item, targetSubject, action: 'squash' });
      } else {
        normalItems.push(item);
      }
    }

    const reorderedList = [];

    for (const norm of normalItems) {
      reorderedList.push(norm);

      // Find any fixup target matches
      const matchingFixups = fixupItems.filter(f => f.targetSubject === norm.subject || norm.subject.startsWith(f.targetSubject));
      for (const fix of matchingFixups) {
        fix.item.action = 'fixup';
        reorderedList.push(fix.item);
      }

      // Find any squash target matches
      const matchingSquashes = squashItems.filter(s => s.targetSubject === norm.subject || norm.subject.startsWith(s.targetSubject));
      for (const sq of matchingSquashes) {
        sq.item.action = 'squash';
        reorderedList.push(sq.item);
      }
    }

    return {
      success: true,
      originalCount: todoList.length,
      reorderedTodoList: reorderedList,
      autosquashedCount: fixupItems.length + squashItems.length
    };
  }
}
