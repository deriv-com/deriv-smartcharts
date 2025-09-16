import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:js/js.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:chart_app/src/interop/js_interop.dart';
import 'package:deriv_chart/deriv_chart.dart' hide AddOnsRepository;
import 'package:chart_app/src/add_ons/add_ons_repository.dart';

/// State and methods of chart web adapter config.
class DrawingToolModel {
  late final InteractiveLayerBehaviour interactiveLayerBehaviour;

  /// Initialize
  DrawingToolModel({required this.interactiveLayerBehaviour}) {
    // Initialize drawing tools and repository
    drawingToolsRepo = AddOnsRepository<DrawingToolConfig>(
      createAddOn: (Map<String, dynamic> map) =>
          DrawingToolConfig.fromJson(map),
      onAddCallback: (AddOnConfig config) {
        // Sync with external preferences after adding a tool
        _loadSavedDrawingTools();
      },
      onLoadCallback: (List<dynamic> items) {
        JsInterop.drawingTool?.onLoad?.call(items);
      },
      onUpdateCallback: (int index, AddOnConfig config) {
        JsInterop.drawingTool?.onUpdate?.call(index, config);
      },
      onRemoveCallback: (int index) {
        // Call the JavaScript onRemove callback to trigger the snackbar
        JsInterop.drawingTool?.onRemove?.call(index);
        _loadSavedDrawingTools();
      },
      getKey: () => 'drawings_$symbol',
    );

    drawingTools = DrawingTools(
      onMouseEnterCallback: (int index) =>
          JsInterop.drawingTool?.onMouseEnter?.call(index),
      onMouseExitCallback: (int index) =>
          JsInterop.drawingTool?.onMouseExit?.call(index),
    )..drawingToolsRepo = drawingToolsRepo;
    interactiveLayerBehaviour.controller.addListener(_onControllerStateChanged);
  }

  /// Symbol of the chart
  String symbol = '';

  /// Drawing tools repo
  late AddOnsRepository<DrawingToolConfig> drawingToolsRepo;

  /// DrawingTools
  late DrawingTools drawingTools;

  InteractiveLayerController get interactiveLayerController =>
      interactiveLayerBehaviour.controller;

  /// Initialize new chart
  void newChart(JSNewChart payload) {
    symbol = payload.symbol ?? '';
    _loadSavedDrawingTools();
  }

  Future<void> _loadSavedDrawingTools() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    drawingToolsRepo.loadFromPrefs(prefs);
  }

  /// To select a drawing
  void selectDrawing(DrawingToolConfig config) {
    drawingTools.onDrawingToolSelection(config);
  }

  /// function to get drawtool items
  // List<DrawingToolConfig>? getDrawingToolsRepoItems() => drawingToolsRepo.items;

  ///
  List<String> getDrawingToolsRepoItems() =>
      drawingToolsRepo.items.map((e) => jsonEncode(e)).toList();

  updateFloatingMenuPosition(double x, double y) {
    interactiveLayerController.floatingMenuPosition = Offset(x, y);
  }

  void startAddingNewTool(String type) {
    final DrawingToolConfig config = getConfigFromType(type);
    interactiveLayerController.startAddingNewTool(config);
  }

  void cancelAddingNewTool() {
    interactiveLayerController.cancelAdding();
  }

  void _onControllerStateChanged() {
    if (interactiveLayerController.currentState is InteractiveAddingToolState) {
      final addingState =
          interactiveLayerController.currentState as InteractiveAddingToolState;
      final stepInfo = addingState.addingStateInfo;

      // Notify TypeScript about state change
      if (stepInfo != null) {
        JsInterop.drawingTool?.onStateChanged?.call(
          stepInfo.currentStep,
          stepInfo.totalSteps,
        );
      }
    }

  }

  /// To remove an existing drawing tool
  void removeDrawingTool(int index) {
    drawingToolsRepo.removeAt(index);
  }

  DrawingToolConfig getConfigFromType(String type) {
    // TODO(Anyone): Uncomment the below cases when their implementations are done.
    switch (type) {
      // case 'vertical':
      //   return const VerticalDrawingToolConfig();
      case 'line':
        return const LineDrawingToolConfig();
      // case 'ray':
      //   return const RayDrawingToolConfig();
      // case 'continuous':
      //   return const ContinuousDrawingToolConfig();
      // case 'trend':
      //   return const TrendDrawingToolConfig();
      case 'horizontal':
        return const HorizontalDrawingToolConfig();
      // case 'channel':
      //   return const ChannelDrawingToolConfig();
      // case 'fibfan':
      //   return const FibfanDrawingToolConfig();
      // case 'rectangle':
      //   return const RectangleDrawingToolConfig();
      default:
        throw Exception('Unknown drawing tool type: $type');
    }
  }

  /// To clear the selection of drawing tool
  void clearDrawingToolSelect() {
    drawingTools.clearDrawingToolSelection();
  }

  /// To clear all drawing tool
  void clearDrawingTool() {
    drawingTools.clearDrawingToolSelection();
    drawingToolsRepo.clear();
  }
}
