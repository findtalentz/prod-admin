import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityItem } from "@/types/ActivityItem";

interface Props {
  activities: ActivityItem[];
}

const typeStyles: Record<string, { color: string }> = {
  user_registered: { color: "bg-green-500" },
  job_created: { color: "bg-blue-500" },
  withdrawal_requested: { color: "bg-orange-500" },
  dispute_opened: { color: "bg-red-500" },
};

function timeAgo(date: string) {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000
  );
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function RecentActivity({ activities }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
          {activities.map((activity) => {
            const style = typeStyles[activity.type] || { color: "bg-gray-500" };
            return (
              <div key={activity._id} className="flex items-start gap-3">
                <div
                  className={`mt-1.5 h-2.5 w-2.5 rounded-full shrink-0 ${style.color}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {timeAgo(activity.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
          {activities.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No recent activity
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
