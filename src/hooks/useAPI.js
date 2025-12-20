import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '../services/api'

// Groups
export const useGroup = (code) => {
  return useQuery({
    queryKey: ['group', code],
    queryFn: () => api.groupsAPI.getByCode(code),
    enabled: !!code
  })
}

export const useCreateGroup = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.groupsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
    }
  })
}

export const useOrganizerGames = (email) => {
  return useQuery({
    queryKey: ['organizer-games', email],
    queryFn: () => api.groupsAPI.getByOrganizerEmail(email),
    enabled: !!email
  })
}

// Participants
export const useParticipant = (code) => {
  return useQuery({
    queryKey: ['participant', code],
    queryFn: () => api.participantsAPI.getByAccessCode(code),
    enabled: !!code
  })
}

export const useAddParticipant = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.participantsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participants'] })
    }
  })
}

// Wishlists
export const useWishlist = (code) => {
  return useQuery({
    queryKey: ['wishlist', code],
    queryFn: () => api.wishlistsAPI.getByAccessCode(code),
    enabled: !!code
  })
}

export const useUpdateWishlist = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ code, data }) => api.wishlistsAPI.update(code, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    }
  })
}

// Draws
export const usePerformDraw = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ groupCode, data }) => api.drawsAPI.performDraw(groupCode, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['draw'] })
    }
  })
}

export const useDraw = (groupCode) => {
  return useQuery({
    queryKey: ['draw', groupCode],
    queryFn: () => api.drawsAPI.getDrawByGroupCode(groupCode),
    enabled: !!groupCode
  })
}

export const useAssignment = (accessCode) => {
  return useQuery({
    queryKey: ['assignment', accessCode],
    queryFn: () => api.drawsAPI.getAssignment(accessCode),
    enabled: !!accessCode
  })
}

// Messages
export const useSendMessage = () => {
  return useMutation({
    mutationFn: (data) => api.messagesAPI.send(data)
  })
}

export const useMessages = (receiverAccessCode) => {
  return useQuery({
    queryKey: ['messages', receiverAccessCode],
    queryFn: () => api.messagesAPI.getMessages(receiverAccessCode),
    enabled: !!receiverAccessCode
  })
}
