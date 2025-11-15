import { View, Text } from 'react-native';
import { CheckCircle2, Circle, Clock } from 'lucide-react-native';

interface Stage {
  index: number;
  code: string;
  name: string;
  status: string;
  completedAt?: string;
  startedAt?: string;
}

export default function ProgressTimeline({ stages }: { stages: Stage[] }) {
  const getStageIcon = (status: string) => {
    if (status === 'done') return <CheckCircle2 size={24} color="#16a34a" />;
    if (status === 'in_progress') return <Clock size={24} color="#3b82f6" />;
    return <Circle size={24} color="#d1d5db" />;
  };

  const getLineColor = (status: string) => {
    if (status === 'done') return 'bg-green-600';
    if (status === 'in_progress') return 'bg-blue-500';
    return 'bg-gray-300';
  };

  return (
    <View>
      {stages.map((stage, index) => (
        <View key={stage.index}>
          <View className="flex-row gap-4">
            {/* Icon */}
            <View className="items-center">
              {getStageIcon(stage.status)}
              {index < stages.length - 1 && (
                <View className={`w-1 h-8 ${getLineColor(stages[index + 1]?.status || 'not_started')}`} />
              )}
            </View>

            {/* Content */}
            <View className="flex-1 pb-6">
              <Text className={`font-semibold ${stage.status === 'in_progress' ? 'text-blue-600' : 'text-gray-900'}`}>
                {stage.name}
              </Text>
              <Text className="text-gray-600 text-xs mt-1">{stage.code}</Text>
              {stage.completedAt && (
                <Text className="text-gray-500 text-xs mt-2">
                  Completed: {new Date(stage.completedAt).toLocaleDateString()}
                </Text>
              )}
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
