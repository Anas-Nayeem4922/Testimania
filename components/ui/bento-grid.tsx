import React from 'react';
import { Star, ThumbsUp, User, Mail, MapPin, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Testimonial } from '@/app/generated/prisma/client';

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[20rem] md:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const TestimonialBentoItem = ({
  className,
  testimonial,
}: {
  className?: string;
  testimonial: Testimonial;
}) => {
  return (
    <div
      className={cn(
        "group/bento shadow-input row-span-1 flex flex-col justify-between space-y-4 rounded-xl border border-gray-700 bg-gray-800/30 p-5 transition duration-200 hover:shadow-xs hover:translate-y-[-5px]",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center">
            <User className="h-6 w-6 text-gray-300" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-200">
              {testimonial.userName || "Anonymous"}
            </h3>
            {testimonial.userEmail && (
              <p className="text-gray-400 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {testimonial.userEmail}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {testimonial.isLiked && (
            <div className="text-blue-400">
              <ThumbsUp className="h-5 w-5" />
            </div>
          )}
          <div className="flex">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star
                key={i}
                className="h-5 w-5 text-yellow-400 fill-yellow-400"
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex-grow pt-4">
        <p className="text-gray-300 text-lg leading-relaxed">
          {testimonial.review}
        </p>
      </div>
      
      <div className="space-y-2 border-t border-gray-700/50 pt-4">
        {testimonial.userAddress && (
          <div className="flex items-center gap-2 text-gray-400">
            <MapPin className="h-4 w-4" />
            {testimonial.userAddress}
          </div>
        )}
        
        {testimonial.userSocials && (
          <div className="flex items-center gap-2 text-gray-400">
            <Globe className="h-4 w-4" />
            {testimonial.userSocials}
          </div>
        )}
      </div>
    </div>
  );
};