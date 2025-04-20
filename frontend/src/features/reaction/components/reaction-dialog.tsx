import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import { ContentType, ReactionItemType } from '@/features/reaction/types/api.types';
import { useReactors } from '../hooks/queries';
import { useReactions } from '../hooks/queries'; 
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ReactionsDialogProps {
  contentType: ContentType;
  contentId: string;
  triggerElement?: React.ReactNode;
  variant?: 'compact' | 'full';
}

export const ReactionsDialog: React.FC<ReactionsDialogProps> = ({
  contentType,
  contentId,
  triggerElement,
}) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ReactionItemType | 'all'>('all');
  
  // Get reaction counts
  const { data: reactionsData, isLoading: isLoadingCounts } = useReactions(contentType, contentId);
  
  // Get reactors list (users who reacted)
  const { 
    data: reactorsData, 
    isLoading: isLoadingReactors 
  } = useReactors(
    contentType, 
    contentId,
    activeTab !== 'all' ? activeTab : undefined
  );
  
  const counts = reactionsData?.counts || { 
    like: 0, 
    love: 0, 
    laugh: 0, 
    sad: 0, 
    angry: 0, 
    total: 0 
  };
  
  // Early return if there are no reactions
  if (counts.total === 0) {
    return null;
  }
  
  // Reaction icons with appropriate styling
  const reactionIcons: Record<ReactionItemType, string> = {
    like: "👍",
    love: "❤️",
    laugh: "😂",
    sad: "😢",
    angry: "😡"
  };
  
  // Colors for each reaction type
  const reactionColors: Record<ReactionItemType, string> = {
    like: 'text-primary',
    love: 'text-red-500',
    laugh: 'text-yellow-500',
    sad: 'text-blue-500',
    angry: 'text-orange-500'
  };
  
  // Labels for each reaction type
  const reactionLabels: Record<ReactionItemType, string> = {
    like: 'Thích',
    love: 'Yêu thích',
    laugh: 'Haha',
    sad: 'Buồn',
    angry: 'Wow'
  };
  
  // Default trigger if none provided
  const defaultTrigger = (
    <Button 
      variant="ghost" 
      size="sm" 
      className="px-1 text-xs text-gray-500 hover:text-gray-700"
    >
      {counts.total} lượt thích
    </Button>
  );

  if(isLoadingCounts) return <div>Đang tải...</div>
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerElement || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Lượt thích</DialogTitle>
        </DialogHeader>
        
        <Tabs 
          defaultValue="all" 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as ReactionItemType | 'all')}
        >
          <TabsList className="w-full grid grid-cols-6">
            <TabsTrigger value="all" className="text-xs py-1">
              Tất cả ({counts.total})
            </TabsTrigger>
            {(Object.keys(reactionIcons) as ReactionItemType[]).map((type) => (
              counts[type] > 0 && (
                <TabsTrigger 
                  key={type} 
                  value={type} 
                  className={cn("text-xs py-1", reactionColors[type])}
                >
                  {reactionIcons[type]}
                  <span className="ml-1 hidden sm:inline">{counts[type]}</span>
                  <span className="ml-1 sm:hidden">{counts[type]}</span>
                </TabsTrigger>
              )
            ))}
          </TabsList>
          
          <ScrollArea className="h-72 mt-4">
            {isLoadingReactors ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                {reactorsData?.reactors && reactorsData.reactors.length > 0 ? (
                  reactorsData.reactors.map((reactor) => (
                    <div key={reactor.userId._id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={reactor.userId.profilePicture?.url} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {reactor.userId.fullName?.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <Link 
                            to={`/profile/${reactor.userId._id}`}
                            className="font-medium text-sm hover:underline"
                          >
                            {reactor.userId.fullName}
                          </Link>
                          <div className="flex items-center text-xs gap-1">
                            {reactionIcons[reactor.reactionType as ReactionItemType]}
                            <span className={reactionColors[reactor.reactionType as ReactionItemType]}>
                              {reactionLabels[reactor.reactionType as ReactionItemType]}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs"
                      >
                        Theo dõi
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Không có dữ liệu
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};