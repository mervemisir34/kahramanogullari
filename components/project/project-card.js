import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';

export default function ProjectCard({ project }) {
  return (
    <Card className="overflow-hidden border-0 shadow-sm bg-white">
      <div className="relative h-64 overflow-hidden">
        <Image
          src={project.images[0]}
          alt={project.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-4 right-4">
          <Badge 
            variant={project.status === 'COMPLETED' ? 'default' : 'secondary'}
            className="bg-white/90 text-foreground border-0"
          >
            {project.status === 'COMPLETED' ? 'Tamamlandı' : 'Devam Ediyor'}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-foreground line-clamp-2">
          <Link href={`/projects/${project.slug}`}>
            {project.title}
          </Link>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-muted-foreground text-sm mb-6 line-clamp-3 leading-relaxed">
          {project.description}
        </p>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            <span>{project.location}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            <span>{new Date(project.createdAt).toLocaleDateString('tr-TR')}</span>
          </div>
        </div>
        
        <Link 
          href={`/projects/${project.slug}`}
          className="inline-flex items-center justify-center w-full h-10 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
        >
          Detayları Gör
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}