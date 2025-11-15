import { View, Text } from 'react-native';
import { CheckCircle2, Circle, Clock } from 'lucide-react-native';

interface Stage {
  _id: string;
  name: string;
  code: string;
  orderIndex: number;
  description: string;
}

interface StagesTimelineProps {
  stages: Stage[];
  currentStageIndex: number;
}

export default function StagesTimeline({ stages, currentStageIndex }: StagesTimelineProps) {
  const getStageStatus = (orderIndex: number): 'done' | 'in_progress' | 'not_started' => {
    if (currentStageIndex < 0) return 'not_started'; // Plant hasn't started yet
    if (orderIndex < currentStageIndex) return 'done';
    if (orderIndex === currentStageIndex) return 'in_progress';
    return 'not_started';
  };

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
      {stages.map((stage, index) => {
        const status = getStageStatus(stage.orderIndex);
        const isLastStage = index === stages.length - 1;
        const nextStageStatus = !isLastStage ? getStageStatus(stages[index + 1].orderIndex) : status;

        return (
          <View key={stage._id}>
            <View className="flex-row gap-4">
              {/* Icon */}
              <View className="items-center">
                {getStageIcon(status)}
                {!isLastStage && (
                  <View className={`w-1 h-16 ${getLineColor(nextStageStatus)}`} />
                )}
              </View>

              {/* Content */}
              <View className="flex-1 pb-6">
                <View className="flex-row items-center justify-between gap-3">
                  <View className="flex-1">
                    <Text className={`font-semibold text-base ${
                      status === 'in_progress' ? 'text-blue-600' : status === 'done' ? 'text-green-700' : 'text-gray-500'
                    }`}>
                      {stage.name}
                    </Text>
                    <Text className="text-gray-600 text-xs mt-1">{stage.code}</Text>
                    <Text className="text-gray-500 text-xs mt-1">{stage.description}</Text>
                  </View>
                  {/* Status Badge */}
                  <View className={`px-3 py-1 rounded-full ${
                    status === 'done' ? 'bg-green-100' : status === 'in_progress' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <Text className={`text-xs font-semibold ${
                      status === 'done' ? 'text-green-700' : status === 'in_progress' ? 'text-blue-700' : 'text-gray-600'
                    }`}>
                      {status === 'done' ? 'Done' : status === 'in_progress' ? 'Current' : 'Pending'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}
