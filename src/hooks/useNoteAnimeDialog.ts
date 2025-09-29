/**
 * 打开关闭笔记对话框的hook
 */

import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export const noteDialogVisible = ref(false)
const noteDialogId = ref<string>('-1')

export function useNoteAnimeDialog() {
  const route = useRoute()
  const router = useRouter()

  function openNoteDialog(id: string) {
    // const route = useRoute()
    // const router = useRouter()
    noteDialogVisible.value = true
    noteDialogId.value = id

    router.push({
      ...route,
      query: {
        ...route.query,
        noteAnimeId: id,
      },
    })
  }

  function closeNoteDialog() {
    // const route = useRoute()
    // const router = useRouter()
    noteDialogVisible.value = false
    noteDialogId.value = '-1'

    router.push({
      ...route,
      query: {
        ...route.query,
        noteAnimeId: undefined,
      },
    })
  }

  // 传入route，从路由中获取id
  function queryNoteDialogId() {
    const noteAnimeId = route.query.noteAnimeId

    if (noteAnimeId) {
      openNoteDialog(noteAnimeId as string)
    }
  }

  return {
    id: noteDialogId,
    openNoteDialog,
    closeNoteDialog,
    queryNoteDialogId,
  }
}
