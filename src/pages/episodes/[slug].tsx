import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { api } from '../../services/api'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'

import styles from './episode.module.scss'
import { PlayerContext } from '../../contexts/PlayerContext'
import { useContext } from 'react'

type Episode = {
  id: string
  title: string
  thumbnail: string
  members: string
  publishedAt: string
  duration: number
  durationAsString: string
  description: string
  url: string
}

type EpisodeProps = {
  episode: Episode
}

export default function Episode({ episode } : EpisodeProps){
  const { play } = useContext(PlayerContext)

  return (
    <div className={styles.episodeContainer}>
      <div className={styles.episode}>
        <div className={styles.thumbnailContainer}>
          <Link href="/">
            <button type="button">
              <img src="/arrow-left.svg" alt="Voltar"/>
            </button>
          </Link>

          <Image 
            width={780}
            height={160}
            src={episode.thumbnail}
            objectFit="cover"
          />

          <button type="button" onClick={() => play(episode)}>
            <img src="/play.svg" alt="Tocar Episódio"/>
          </button>
        </div>

        <header>
          <h1>{episode.title}</h1>
          <span>{episode.members}</span>
          <span>{episode.publishedAt}</span>
          <span>{episode.durationAsString}</span>
        </header>

        <div 
          className={styles.description} 
          dangerouslySetInnerHTML={{ __html:episode.description }}
        />

      </div>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () =>{
  return{
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (context) =>{
  const { slug } = context.params
  
  const { data } = await api.get('episodes')


  
  var selected
  data.episodes.map(ep => {
    if(ep.id === slug){
      selected = ep
    }    
  })

  const episode = {
    id: selected.id,
    title: selected.title,
    thumbnail: selected.thumbnail,
    members: selected.members,
    publishedAt: format(parseISO(selected.published_at), 'd MMM yy', { locale: ptBR }),
    duration: Number(selected.file.duration),
    durationAsString: convertDurationToTimeString(Number(selected.file.duration)),
    description: selected.description,
    url: selected.file.url
  }
  
  return{
    props: {episode},
    revalidate: 60 * 60 * 24
  }
}