import {DocumentTextIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const playlist = defineType({
  name: 'playlist',
  title: 'Playlist',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
      },
    }),
    defineField({
      name: 'select',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: {type: 'post'}})],
    }),
    
  ],
})
