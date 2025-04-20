import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Badge 
} from "@/components/ui/badge";
import {
  Button,
} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { ReportType } from "@/features/post/types/api.types";

interface ReportItemProps {
  report: ReportType;
  onResolve: (reportId: string, status: 'resolved' | 'rejected', response: string) => void;
}

export function ReportItem({ report, onResolve }: ReportItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<'resolved' | 'rejected'>('resolved');
  const [response, setResponse] = useState('');
  
  const reporter = typeof report.userId === 'object' 
    ? report.userId.fullName 
    : 'User ID: ' + report.userId;
  
  const createdAt = new Date(report.createdAt);
  
  const getStatusBadge = () => {
    switch(report.status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500">Resolved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return null;
    }
  };
  
  const handleSubmit = () => {
    onResolve(report._id, status, response);
    setIsOpen(false);
  };
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{reporter}</CardTitle>
          {getStatusBadge()}
        </div>
        <p className="text-sm text-gray-500">
          {formatDistanceToNow(createdAt, { addSuffix: true })}
        </p>
      </CardHeader>
      <CardContent className="py-2">
        <p className="font-medium mb-1">Reason: {report.reason}</p>
        {report.details && (
          <p className="text-gray-700 text-sm">{report.details}</p>
        )}
        {report.response && (
          <div className="mt-2 p-2 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">Response: {report.response}</p>
          </div>
        )}
      </CardContent>
      {report.status === 'pending' && (
        <CardFooter className="pt-2">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm">Respond to Report</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Respond to Report</DialogTitle>
                <DialogDescription>
                  Review this report and provide a response.
                </DialogDescription>
              </DialogHeader>
              
              <div className="my-2">
                <p className="text-sm mb-1">Reporter: {reporter}</p>
                <p className="text-sm mb-3">Reason: {report.reason}</p>
                
                <div className="mb-4">
                  <label className="text-sm font-medium mb-1 block">
                    Action:
                  </label>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant={status === 'resolved' ? 'default' : 'outline'}
                      onClick={() => setStatus('resolved')}
                      size="sm"
                    >
                      Resolve
                    </Button>
                    <Button
                      type="button"
                      variant={status === 'rejected' ? 'default' : 'outline'}
                      onClick={() => setStatus('rejected')}
                      size="sm"
                    >
                      Reject
                    </Button>
                  </div>
                </div>
                
                <div className="mb-2">
                  <label className="text-sm font-medium mb-1 block">
                    Response:
                  </label>
                  <Textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Provide your response to this report..."
                    className="resize-none"
                    rows={4}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button onClick={() => setIsOpen(false)} variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleSubmit} type="submit">
                  Submit Response
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      )}
    </Card>
  );
}