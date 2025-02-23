# -*- coding: utf-8 -*-
# @author: xiaobai
from fastapi import APIRouter

from autotest.corelibs.http_response import partner_success
from autotest.schemas.ui.ui_element import UiElementQuery, UiElementIn, UiElementId
from autotest.services.ui.ui_element import UiElementServer

router = APIRouter()


@router.post("/list")
async def ui_element_list(params: UiElementQuery):
    """获取页面元素列表"""
    data = await UiElementServer.list(params)
    return partner_success(data)


@router.post("/saveOrUpdate")
async def save_or_update(params: UiElementIn):
    """保存或更新页面元素信息"""
    data = await UiElementServer.save_or_update(params)
    return partner_success(data)


@router.post("/deleted")
async def save_or_update(params: UiElementId):
    """删除页面元素信息"""
    data = await UiElementServer.deleted(params.id)
    return partner_success(data)
