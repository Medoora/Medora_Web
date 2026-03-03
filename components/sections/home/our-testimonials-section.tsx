'use client'

import React, { useEffect, useState } from 'react'
import SectionTitle from '@/components/section-title'
import TestimonialsCard from './components/testimonialsCard'
import Marquee from 'react-fast-marquee'
import { useTheme } from 'next-themes'

import { Loader2 } from 'lucide-react'
import { TestimonialsData } from '@/constant/constant'
import { TestimonialData, testimonialService } from '@/lib/firebase/service/testimonials/service'

export default function OurTestimonialSection() {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([])
  const [loading, setLoading] = useState(true)
  const { theme } = useTheme()

  useEffect(() => {
    setLoading(true)
    
    // Subscribe to real-time updates
    const unsubscribe = testimonialService.subscribeToTestimonials((updatedTestimonials) => {
      setTestimonials(updatedTestimonials)
      setLoading(false)
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  // Combine static data with dynamic data for fallback
  const staticTestimonials: TestimonialData[] = TestimonialsData.map((item, index) => ({
    id: `static-${index}`,
    name: item.name,
    about: item.about,
    review: item.review,
    rating: 5,
    image: item.image,
    imageUrl: item.image,
    status: 'approved',
    createdAt: new Date() as any
  }))

  // Use dynamic testimonials if available, otherwise use static data
  const displayTestimonials = testimonials.length > 0 ? testimonials : staticTestimonials

  // Duplicate data for marquee effect
  const marqueeData = displayTestimonials.length > 0 
    ? [...displayTestimonials, ...displayTestimonials] 
    : []

  if (loading && testimonials.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center py-12 min-h-[400px]">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
          <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
          <div className="flex justify-center gap-4 mt-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-72 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="testimonials" className='scroll-mt-8 flex flex-col items-center justify-center py-12'>
      <SectionTitle
        title='What Our Users Say'
        subtitle='Real experiences from patients and healthcare professionals using Medora to manage medical records.'
      />

      {displayTestimonials.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No testimonials yet. Be the first to share your experience!</p>
          <a 
            href="/testimonials" 
            className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Write a Testimonial
          </a>
        </div>
      ) : (
        <>
          <Marquee
            className="max-w-6xl mx-auto mt-12 py-2 overflow-clip"
            gradientColor={theme === 'dark' ? "black" : "white"}
            gradient
            speed={30}
          >
            <div className="flex ">
              {marqueeData.map((testimonial, index) => (
                <TestimonialsCard
                  key={`top-${testimonial.id}-${index}`}
                  data={testimonial}
                />
              ))}
            </div>
          </Marquee>

          <Marquee
            className="max-w-6xl mx-auto mt-2 py-2 overflow-clip"
            gradientColor={theme === 'dark' ? "black" : "white"}
            gradient
            direction="right"
            speed={25}
          >
            <div className="flex ">
              {marqueeData.map((testimonial, index) => (
                <TestimonialsCard
                  key={`bottom-${testimonial.id}-${index}`}
                  data={testimonial}
                />
              ))}
            </div>
          </Marquee>

          {/* Show count of testimonials */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            {testimonials.length} real stories from our users
          </p>
        </>
      )}
    </section>
  )
}