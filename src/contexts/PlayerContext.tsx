import { createContext, ReactNode, useState } from "react"

type Episode = {
  title: string
  members: string
  thumbnail: string
  duration: number
  url: string
}

type PlayerContextData = {
  episodeList: Episode[] 
  currentEpisodeIndex: number
  isPlaying: boolean
  play: (episode: Episode) => void
  playList: (episode: Episode[], index: number) => void
  togglePlay: () => void
  playNext: () => void
  playPrevius: () => void
  setPlayingState: (state: boolean) => void
  hasNext: boolean
  hasPrevius: boolean
}

export const PlayerContext = createContext({} as PlayerContextData)

type PlayerContextProviderProps = {
  children: ReactNode
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps){
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  function play(episode: Episode){
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
    console.log('isPlaying')
  }

  function playList(list: Episode[], index: number){
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  function togglePlay(){
    setIsPlaying(!isPlaying)
  }

  function setPlayingState(state: boolean){
    setIsPlaying(state)
  }

  const hasNext = (currentEpisodeIndex + 1) < episodeList.length
  const hasPrevius = (currentEpisodeIndex - 1) >= 0

  function playNext(){
   if(hasNext){
      setCurrentEpisodeIndex(currentEpisodeIndex + 1)
    }    
  }

  function playPrevius(){
    if(hasPrevius){
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }    
  }

  return (
    <PlayerContext.Provider 
      value={{ 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        play,
        playList, 
        togglePlay, 
        playNext,
        playPrevius,
        setPlayingState,
        hasNext,
        hasPrevius 
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

